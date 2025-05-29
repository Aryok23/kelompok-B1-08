package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"

	"path/filepath"
	"strconv"
	"time"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/models"

	"github.com/go-chi/chi/v5"
)

type ParseResponse struct {
	PengalamanKerja    string `json:"pengalaman_kerja"`
	Keterampilan       string `json:"ketrampilan"`
	BackgroundKandidat string `json:"background_kandidat"`
}

func UploadCV(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	kandidatIDStr := r.FormValue("kandidat_id")
	kandidatID, err := strconv.Atoi(kandidatIDStr)
	if err != nil {
		http.Error(w, "Invalid kandidat_id", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File not provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if filepath.Ext(header.Filename) != ".pdf" {
		http.Error(w, "Only PDF files are allowed", http.StatusBadRequest)
		return
	}

	filename := fmt.Sprintf("cv_%d_%d.pdf", kandidatID, time.Now().Unix())
	savePath := filepath.Join("uploads", filename)
	out, err := os.Create(savePath)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	cv := models.CV{
		KandidatID:    kandidatID,
		FileName:      header.Filename,
		FilePath:      savePath,
		FileType:      "application/pdf",
		TanggalUnggah: time.Now(),
	}
	err = db.DB.QueryRow(
		context.Background(),
		`INSERT INTO CV (kandidat_id, file_name, file_path, file_type, tanggal_unggah)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		cv.KandidatID, cv.FileName, cv.FilePath, cv.FileType, cv.TanggalUnggah,
	).Scan(&cv.ID)
	if err != nil {
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		return
	}

	// Kirim file ke FastAPI
	parsed, err := sendPDFToFastAPI(cv.FilePath, kandidatID)
	if err != nil {
		http.Error(w, "Failed to parse resume with FastAPI", http.StatusInternalServerError)
		return
	}

	// Simpan hasil parsing
	_, err = db.DB.Exec(context.Background(), `
		INSERT INTO Parsed_Resume (cv_id, pengalaman_kerja, keterampilan, background_kandidat)
		VALUES ($1, $2, $3, $4)`,
		cv.ID, parsed.PengalamanKerja, parsed.Keterampilan, parsed.BackgroundKandidat)
	if err != nil {
		http.Error(w, "Failed to save parsed resume", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("CV uploaded and parsed successfully with CV ID %d", cv.ID)))
}

func UpdateCV(w http.ResponseWriter, r *http.Request) {
	cvIDStr := chi.URLParam(r, "cv_id")
	cvID, err := strconv.Atoi(cvIDStr)
	if err != nil {
		http.Error(w, "Invalid CV ID", http.StatusBadRequest)
		return
	}

	r.ParseMultipartForm(10 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	var oldPath string
	var kandidatID int
	err = db.DB.QueryRow(context.Background(),
		"SELECT file_path, kandidat_id FROM cv WHERE id = $1", cvID).Scan(&oldPath, &kandidatID)
	if err != nil {
		http.Error(w, "CV not found", http.StatusNotFound)
		return
	}

	os.Remove(oldPath)

	newFilename := fmt.Sprintf("cv_updated_%d_%d.pdf", cvID, time.Now().Unix())
	newPath := filepath.Join("uploads", newFilename)
	out, err := os.Create(newPath)
	if err != nil {
		http.Error(w, "Failed to save new file", http.StatusInternalServerError)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	_, err = db.DB.Exec(context.Background(),
		`UPDATE CV SET file_name = $1, file_path = $2, tanggal_unggah = $3 WHERE id = $4`,
		header.Filename, newPath, time.Now(), cvID)
	if err != nil {
		http.Error(w, "Failed to update CV", http.StatusInternalServerError)
		return
	}

	// Kirim file ke FastAPI
	parsed, err := sendPDFToFastAPI(newPath, kandidatID)
	if err != nil {
		http.Error(w, "Failed to parse updated resume", http.StatusInternalServerError)
		return
	}

	// Update parsed_resume
	_, err = db.DB.Exec(context.Background(), `
		UPDATE Parsed_Resume SET 
			pengalaman_kerja = $1,
			keterampilan = $2,
			background_kandidat = $3
		WHERE cv_id = $4`,
		parsed.PengalamanKerja, parsed.Keterampilan, parsed.BackgroundKandidat, cvID)
	if err != nil {
		http.Error(w, "Failed to update parsed resume", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("CV updated and parsed resume updated successfully"))
}

// Fungsi untuk mengirim file PDF ke FastAPI dan ambil hasil parsing
func sendPDFToFastAPI(filePath string, kandidatID int) (*ParseResponse, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("could not open PDF file: %w", err)
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := io.MultiWriter(body)
	multipart := multipartWriter(writer, file, kandidatID)

	req, err := http.NewRequest("POST", "http://localhost:8000/match/parse/resume", body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", multipart.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var parsed ParseResponse
	err = json.NewDecoder(resp.Body).Decode(&parsed)
	if err != nil {
		return nil, err
	}
	return &parsed, nil
}

// Helper untuk membuat multipart/form-data dengan PDF dan kandidat_id
func multipartWriter(writer io.Writer, file *os.File, kandidatID int) *multipart.Writer {
	mp := multipart.NewWriter(writer)
	part, _ := mp.CreateFormFile("file", filepath.Base(file.Name()))
	io.Copy(part, file)
	mp.WriteField("kandidat_id", strconv.Itoa(kandidatID))
	mp.Close()
	return mp
}

func GetCVByKandidat(w http.ResponseWriter, r *http.Request) {
	kandidatIDStr := chi.URLParam(r, "kandidat_id")
	kandidatID, err := strconv.Atoi(kandidatIDStr)
	if err != nil {
		http.Error(w, "Invalid kandidat_id", http.StatusBadRequest)
		return
	}

	rows, err := db.DB.Query(context.Background(),
		`SELECT id, kandidat_id, file_name, file_path, tanggal_unggah 
		 FROM cv 
		 WHERE kandidat_id = $1`, kandidatID)
	if err != nil {
		http.Error(w, "Failed to fetch CVs", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cvs []map[string]interface{}

	for rows.Next() {
		var id int
		var fileName, filePath string
		var tanggalUnggah time.Time

		if err := rows.Scan(&id, &kandidatID, &fileName, &filePath, &tanggalUnggah); err != nil {
			http.Error(w, "Error scanning CV", http.StatusInternalServerError)
			return
		}

		cvs = append(cvs, map[string]interface{}{
			"id":             id,
			"kandidat_id":    kandidatID,
			"file_name":      fileName,
			"file_path":      filePath,
			"tanggal_unggah": tanggalUnggah.Format("2006-01-02 15:04:05"),
		})
	}

	if len(cvs) == 0 {
		http.Error(w, "No CVs found for this kandidat", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cvs)
}
