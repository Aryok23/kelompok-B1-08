package handlers

import (
	"encoding/json"
	"net/http"

	"context"

	"strconv"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/go-chi/chi/v5"
)

type Matching struct {
	ID             int     `json:"id"`
	ParsedResumeID int     `json:"parsed_resume_id"`
	JobID          int     `json:"job_id"`
	SkorRelevansi  float64 `json:"skor_relevansi"`
}

func CreateMatching(w http.ResponseWriter, r *http.Request) {
	var m Matching
	err := json.NewDecoder(r.Body).Decode(&m)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = db.DB.QueryRow(context.Background(), `INSERT INTO Matching (parsed_resume_id, job_id, skor_relevansi) VALUES ($1, $2, $3) RETURNING id`, m.ParsedResumeID, m.JobID, m.SkorRelevansi).Scan(&m.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(m)
}

func GetMatchingByParsedResumeID(w http.ResponseWriter, r *http.Request) {
	parsedResumeID := chi.URLParam(r, "parsed_resume_id")

	rows, err := db.DB.Query(context.Background(), `SELECT id, parsed_resume_id, job_id, skor_relevansi FROM Matching WHERE parsed_resume_id = $1`, parsedResumeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var matchings []Matching
	for rows.Next() {
		var m Matching
		err := rows.Scan(&m.ID, &m.ParsedResumeID, &m.JobID, &m.SkorRelevansi)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		matchings = append(matchings, m)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(matchings)
}
func UpdateMatching(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid matching ID", http.StatusBadRequest)
		return
	}

	var m Matching
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		UPDATE Matching
		SET parsed_resume_id = $1, job_id = $2, skor_relevansi = $3
		WHERE id = $4
	`
	_, err = db.DB.Exec(context.Background(), query, m.ParsedResumeID, m.JobID, m.SkorRelevansi, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	m.ID = id
	json.NewEncoder(w).Encode(m)
}
