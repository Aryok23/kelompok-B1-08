package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/models"
	"github.com/go-chi/chi/v5"
)

func UploadCV(w http.ResponseWriter, r *http.Request) {
	// Parse form max size ~10MB
	r.ParseMultipartForm(10 << 20)

	// Ambil kandidat_id dari form
	kandidatIDStr := r.FormValue("kandidat_id")
	kandidatID, err := strconv.Atoi(kandidatIDStr)
	if err != nil {
		http.Error(w, "Invalid kandidat_id", http.StatusBadRequest)
		return
	}

	// Ambil file dari form
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File not provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validasi format file
	if filepath.Ext(header.Filename) != ".pdf" {
		http.Error(w, "Only PDF files are allowed", http.StatusBadRequest)
		return
	}

	// Simpan file ke folder
	filename := fmt.Sprintf("cv_%d_%d.pdf", kandidatID, time.Now().Unix())
	savePath := filepath.Join("uploads", filename)

	out, err := os.Create(savePath)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	// Simpan metadata ke database
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

	// Beri response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("CV uploaded successfully with ID %d", cv.ID)))
}

func GetCVByKandidat(w http.ResponseWriter, r *http.Request) {
	kandidatIDStr := chi.URLParam(r, "kandidat_id")
	kandidatID, err := strconv.Atoi(kandidatIDStr)
	if err != nil {
		http.Error(w, "Invalid kandidat_id", http.StatusBadRequest)
		return
	}

	rows, err := db.DB.Query(context.Background(), `
		SELECT id, kandidat_id, file_name, file_path, file_type, tanggal_unggah
		FROM cv
		WHERE kandidat_id = $1
	`, kandidatID)
	if err != nil {
		http.Error(w, "Database query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type CV struct {
		ID            int       `json:"id"`
		KandidatID    int       `json:"kandidat_id"`
		FileName      string    `json:"file_name"`
		FilePath      string    `json:"file_path"`
		FileType      string    `json:"file_type"`
		TanggalUnggah time.Time `json:"tanggal_unggah"`
	}

	var cvs []CV
	for rows.Next() {
		var cv CV
		if err := rows.Scan(&cv.ID, &cv.KandidatID, &cv.FileName, &cv.FilePath, &cv.FileType, &cv.TanggalUnggah); err != nil {
			http.Error(w, "Failed to scan row", http.StatusInternalServerError)
			return
		}
		cvs = append(cvs, cv)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cvs)
}

func UpdateCV(w http.ResponseWriter, r *http.Request) {
	cvIDStr := chi.URLParam(r, "cv_id")
	cvID, err := strconv.Atoi(cvIDStr)
	if err != nil {
		http.Error(w, "Invalid CV ID", http.StatusBadRequest)
		return
	}

	// Parse form dan ambil file baru
	r.ParseMultipartForm(10 << 20)
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "File is required", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Ambil data lama (file_path)
	var oldPath string
	err = db.DB.QueryRow(context.Background(),
		"SELECT file_path FROM cv WHERE id = $1", cvID).Scan(&oldPath)
	if err != nil {
		http.Error(w, "CV not found", http.StatusNotFound)
		return
	}

	// Hapus file lama
	os.Remove(oldPath)

	// Simpan file baru
	newFilename := fmt.Sprintf("cv_updated_%d_%d.pdf", cvID, time.Now().Unix())
	newPath := filepath.Join("uploads", newFilename)
	out, err := os.Create(newPath)
	if err != nil {
		http.Error(w, "Failed to save new file", http.StatusInternalServerError)
		return
	}
	defer out.Close()
	io.Copy(out, file)

	// Update record di DB
	_, err = db.DB.Exec(context.Background(),
		`UPDATE cv SET file_name = $1, file_path = $2, tanggal_unggah = $3 WHERE id = $4`,
		header.Filename, newPath, time.Now(), cvID)
	if err != nil {
		http.Error(w, "Failed to update CV", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("CV updated successfully"))
}
