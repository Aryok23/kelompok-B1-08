package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/models"
	"github.com/go-chi/chi/v5"
)

// CreateJob handles creation of a job post
func CreateJob(w http.ResponseWriter, r *http.Request) {
	var input models.JobInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	var jobID int
	err := db.DB.QueryRow(context.Background(), `
		INSERT INTO Jobs (recruiter_id, nama_pekerjaan, deskripsi_pekerjaan, tanggal_posting)
		VALUES ($1, $2, $3, $4) RETURNING id
	`, input.RecruiterID, input.NamaPekerjaan, input.DeskripsiPekerjaan, time.Now()).Scan(&jobID)

	if err != nil {
		http.Error(w, "Failed to create job: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"message": "Job created", "id": jobID})
}

// GetAllJobs retrieves all job postings
func GetAllJobs(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(context.Background(), `
		SELECT 
			j.id,
			j.nama_pekerjaan,
			j.deskripsi_pekerjaan,
			j.tanggal_posting,
			r.perusahaan
		FROM jobs j
		JOIN recruiter r ON j.recruiter_id = r.id
	`)
	if err != nil {
		http.Error(w, "Failed to retrieve jobs", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Struct untuk response (bisa beda dari models.Job jika perlu tambahan nama perusahaan)
	type JobResponse struct {
		ID             int       `json:"id"`
		NamaPekerjaan  string    `json:"title"`
		Deskripsi      string    `json:"description"`
		TanggalPosting time.Time `json:"posted"`
		NamaPerusahaan string    `json:"company"`
	}

	var jobs []JobResponse
	for rows.Next() {
		var job JobResponse
		if err := rows.Scan(
			&job.ID,
			&job.NamaPekerjaan,
			&job.Deskripsi,
			&job.TanggalPosting,
			&job.NamaPerusahaan,
		); err != nil {
			http.Error(w, "Error scanning job", http.StatusInternalServerError)
			return
		}
		jobs = append(jobs, job)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(jobs)
}

// GetJobByID returns a single job post by ID
func GetJobByID(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "job_id")
	jobID, err := strconv.Atoi(jobIDStr)
	if err != nil {
		http.Error(w, "Invalid job ID", http.StatusBadRequest)
		return
	}

	var job models.Job
	err = db.DB.QueryRow(context.Background(), `
		SELECT id, recruiter_id, nama_pekerjaan, deskripsi_pekerjaan, tanggal_posting FROM Jobs WHERE id = $1
	`, jobID).Scan(&job.ID, &job.RecruiterID, &job.NamaPekerjaan, &job.DeskripsiPekerjaan, &job.TanggalPosting)

	if err != nil {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(job)
}

// UpdateJob updates an existing job post
func UpdateJob(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "job_id")
	jobID, err := strconv.Atoi(jobIDStr)
	if err != nil {
		http.Error(w, "Invalid job ID", http.StatusBadRequest)
		return
	}

	var input models.JobInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	_, err = db.DB.Exec(context.Background(), `
		UPDATE Jobs SET nama_pekerjaan = $1, deskripsi_pekerjaan = $2 WHERE id = $3
	`, input.NamaPekerjaan, input.DeskripsiPekerjaan, jobID)

	if err != nil {
		http.Error(w, "Failed to update job", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Job updated"})
}

// DeleteJob deletes a job post
func DeleteJob(w http.ResponseWriter, r *http.Request) {
	jobIDStr := chi.URLParam(r, "job_id")
	jobID, err := strconv.Atoi(jobIDStr)
	if err != nil {
		http.Error(w, "Invalid job ID", http.StatusBadRequest)
		return
	}

	_, err = db.DB.Exec(context.Background(), `DELETE FROM Jobs WHERE id = $1`, jobID)
	if err != nil {
		http.Error(w, "Failed to delete job", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Job deleted"})
}
