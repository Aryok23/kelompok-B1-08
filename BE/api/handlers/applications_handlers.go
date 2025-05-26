package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/go-chi/chi/v5"
)

type Application struct {
	ID           int    `json:"id"`
	KandidatID   int    `json:"kandidat_id"`
	JobID        int    `json:"job_id"`
	TanggalApply string `json:"tanggal_apply"`
}

func CreateApplication(w http.ResponseWriter, r *http.Request) {
	var app Application
	if err := json.NewDecoder(r.Body).Decode(&app); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := db.DB.QueryRow(context.Background(), "INSERT INTO Applications (kandidat_id, job_id) VALUES ($1, $2) RETURNING id, tanggal_apply",
		app.KandidatID, app.JobID).Scan(&app.ID, &app.TanggalApply)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(app)
}

func GetApplicationsByKandidatID(w http.ResponseWriter, r *http.Request) {
	kandidatID := chi.URLParam(r, "kandidat_id")

	rows, err := db.DB.Query(context.Background(), "SELECT id, kandidat_id, job_id, tanggal_apply FROM Applications WHERE kandidat_id = $1", kandidatID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var applications []Application
	for rows.Next() {
		var app Application
		if err := rows.Scan(&app.ID, &app.KandidatID, &app.JobID, &app.TanggalApply); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		applications = append(applications, app)
	}
	json.NewEncoder(w).Encode(applications)
}

func DeleteApplication(w http.ResponseWriter, r *http.Request) {
	appID := chi.URLParam(r, "application_id")

	_, err := db.DB.Exec(context.Background(), "DELETE FROM Applications WHERE id = $1", appID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
