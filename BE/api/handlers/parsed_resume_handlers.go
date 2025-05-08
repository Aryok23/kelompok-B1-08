package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/models"
)

func SaveParsedResume(w http.ResponseWriter, r *http.Request) {
	var input models.ParsedResumeInput

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Cek apakah parsed resume sudah ada untuk cv_id ini
	var exists bool
	err := db.DB.QueryRow(context.Background(), `
		SELECT EXISTS (SELECT 1 FROM parsed_resume WHERE cv_id = $1)
	`, input.CvID).Scan(&exists)

	if err != nil {
		http.Error(w, "Error checking existing parsed resume", http.StatusInternalServerError)
		return
	}

	if exists {
		http.Error(w, "Parsed resume already exists for this CV", http.StatusConflict)
		return
	}

	// Simpan ke database
	_, err = db.DB.Exec(context.Background(), `
		INSERT INTO parsed_resume (cv_id, pengalaman_kerja, keterampilan, background_kandidat)
		VALUES ($1, $2, $3, $4)
	`, input.CvID, input.PengalamanKerja, input.Keterampilan, input.BackgroundKandidat)

	if err != nil {
		http.Error(w, "Failed to save parsed resume", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Parsed resume saved successfully"))
}

func GetParsedResumeByCVID(w http.ResponseWriter, r *http.Request) {
	cvIDParam := chi.URLParam(r, "cv_id")
	cvID, err := strconv.Atoi(cvIDParam)
	if err != nil {
		http.Error(w, "Invalid CV ID", http.StatusBadRequest)
		return
	}

	var resume models.ParsedResume
	err = db.DB.QueryRow(context.Background(), `
		SELECT id, cv_id, pengalaman_kerja, keterampilan, background_kandidat
		FROM parsed_resume
		WHERE cv_id = $1
	`, cvID).Scan(&resume.ID, &resume.CvID, &resume.PengalamanKerja, &resume.Keterampilan, &resume.BackgroundKandidat)

	if err != nil {
		http.Error(w, "Parsed resume not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resume)
}

func UpdateParsedResume(w http.ResponseWriter, r *http.Request) {
	cvIDParam := chi.URLParam(r, "cv_id")
	cvID, err := strconv.Atoi(cvIDParam)
	if err != nil {
		http.Error(w, "Invalid CV ID", http.StatusBadRequest)
		return
	}

	var input models.ParsedResumeInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	cmdTag, err := db.DB.Exec(context.Background(), `
		UPDATE parsed_resume
		SET pengalaman_kerja = $1,
			keterampilan = $2,
			background_kandidat = $3
		WHERE cv_id = $4
	`, input.PengalamanKerja, input.Keterampilan, input.BackgroundKandidat, cvID)

	if err != nil {
		http.Error(w, "Failed to update parsed resume", http.StatusInternalServerError)
		return
	}

	if cmdTag.RowsAffected() == 0 {
		http.Error(w, "Parsed resume not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Parsed resume updated successfully"))
}
