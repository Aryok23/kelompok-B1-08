package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/Timotius2005/InfoLoker-BE/db"
)

type Matching struct {
	ID             int     `json:"id"`
	ParsedResumeID int     `json:"parsed_resume_id"`
	JobID          int     `json:"job_id"`
	SkorRelevansi  float64 `json:"skor_relevansi"`
}

// JobData digunakan untuk mengirim data pekerjaan ke FastAPI
type JobData struct {
	NamaPekerjaan      string `json:"nama_pekerjaan"`
	DeskripsiPekerjaan string `json:"deskripsi_pekerjaan"`
}

// KandidatData digunakan untuk mengirim data kandidat (resume yang sudah diparse) ke FastAPI
type KandidatData struct {
	PengalamanKerja    string `json:"pengalaman_kerja"`
	Keterampilan       string `json:"keterampilan"`
	BackgroundKandidat string `json:"background_kandidat"`
}

// SpecificJobRequest payload untuk request matching ke FastAPI
type SpecificJobRequest struct {
	KandidatID int          `json:"kandidat_id"`
	JobID      int          `json:"job_id"`
	Kandidat   KandidatData `json:"kandidat"`
	Job        JobData      `json:"job"`
}

// FastAPIResponse response dari FastAPI berisi skor similarity
type FastAPIResponse struct {
	KandidatID      int     `json:"kandidat_id"`
	JobID           int     `json:"job_id"`
	NamaPekerjaan   string  `json:"nama_pekerjaan"`
	SimilarityScore float64 `json:"similarity_score"`
}

// Ambil parsed resume berdasarkan kandidat_id dari DB
func getParsedResumeByKandidatID(kandidatID int) (KandidatData, int, error) {
	var kd KandidatData
	var parsedResumeID int

	err := db.DB.QueryRow(context.Background(),
		`SELECT pr.id, pr.pengalaman_kerja, pr.keterampilan, pr.background_kandidat
		 FROM Parsed_Resume pr
		 JOIN CV cv ON pr.cv_id = cv.id
		 WHERE cv.kandidat_id = $1`,
		kandidatID).Scan(&parsedResumeID, &kd.PengalamanKerja, &kd.Keterampilan, &kd.BackgroundKandidat)

	if err != nil {
		return kd, 0, err
	}
	return kd, parsedResumeID, nil
}

// Kirim request matching ke FastAPI dan ambil response
func sendToFastAPI(reqData SpecificJobRequest, fastAPIBaseURL string) (*FastAPIResponse, error) {
	jsonData, err := json.Marshal(reqData)
	if err != nil {
		return nil, fmt.Errorf("error marshaling request: %w", err)
	}

	resp, err := http.Post(fastAPIBaseURL+"/specific-job", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("error sending request to FastAPI: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("FastAPI returned status: %d", resp.StatusCode)
	}

	var fastAPIResp FastAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&fastAPIResp); err != nil {
		return nil, fmt.Errorf("error decoding FastAPI response: %w", err)
	}

	return &fastAPIResp, nil
}

// Handler untuk membuat matching dengan similarity score dari FastAPI
func CreateMatchingWithSimilarity(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		KandidatID int    `json:"kandidat_id"`
		JobID      int    `json:"job_id"`
		FastAPIURL string `json:"fastapi_url,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	fastAPIURL := reqBody.FastAPIURL
	if fastAPIURL == "" {
		fastAPIURL = "http://localhost:8000/match"
	}

	// Ambil parsed resume kandidat
	kandidatData, parsedResumeID, err := getParsedResumeByKandidatID(reqBody.KandidatID)
	if err != nil {
		http.Error(w, "Parsed resume not found for kandidat: "+err.Error(), http.StatusNotFound)
		return
	}

	// Ambil data job dari DB
	var jobData JobData
	err = db.DB.QueryRow(context.Background(),
		`SELECT nama_pekerjaan, deskripsi_pekerjaan FROM Jobs WHERE id = $1`,
		reqBody.JobID).Scan(&jobData.NamaPekerjaan, &jobData.DeskripsiPekerjaan)

	if err != nil {
		http.Error(w, "Job not found: "+err.Error(), http.StatusNotFound)
		return
	}

	// Buat request ke FastAPI
	fastAPIReq := SpecificJobRequest{
		KandidatID: parsedResumeID,
		JobID:      reqBody.JobID,
		Kandidat:   kandidatData,
		Job:        jobData,
	}

	fastAPIResp, err := sendToFastAPI(fastAPIReq, fastAPIURL)
	if err != nil {
		http.Error(w, "Error calculating similarity: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Simpan hasil matching ke DB
	var matching Matching
	err = db.DB.QueryRow(context.Background(),
		`INSERT INTO Matching (parsed_resume_id, job_id, skor_relevansi) VALUES ($1, $2, $3) RETURNING id`,
		parsedResumeID, reqBody.JobID, fastAPIResp.SimilarityScore).Scan(&matching.ID)

	if err != nil {
		http.Error(w, "Error saving matching result: "+err.Error(), http.StatusInternalServerError)
		return
	}

	matching.ParsedResumeID = parsedResumeID
	matching.JobID = reqBody.JobID
	matching.SkorRelevansi = fastAPIResp.SimilarityScore

	response := map[string]interface{}{
		"matching":         matching,
		"fastapi_response": fastAPIResp,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Handler batch processing matching similarity untuk semua kombinasi parsed resume dan job
func CreateBatchMatching(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		ParsedResumeIDs []int  `json:"parsed_resume_ids,omitempty"`
		JobIDs          []int  `json:"job_ids,omitempty"`
		FastAPIURL      string `json:"fastapi_url,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	fastAPIURL := reqBody.FastAPIURL
	if fastAPIURL == "" {
		fastAPIURL = "http://localhost:8000/match"
	}

	var results []map[string]interface{}
	var errors []string

	// Query parsed resumes
	resumeQuery := `SELECT id, pengalaman_kerja, keterampilan, background_kandidat FROM Parsed_Resume`
	var resumeArgs []interface{}
	if len(reqBody.ParsedResumeIDs) > 0 {
		resumeQuery += " WHERE id = ANY($1)"
		resumeArgs = append(resumeArgs, reqBody.ParsedResumeIDs)
	}

	resumeRows, err := db.DB.Query(context.Background(), resumeQuery, resumeArgs...)
	if err != nil {
		http.Error(w, "Error querying parsed resumes: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resumeRows.Close()

	var resumes []struct {
		ID   int
		Data KandidatData
	}

	for resumeRows.Next() {
		var resume struct {
			ID   int
			Data KandidatData
		}
		if err := resumeRows.Scan(&resume.ID, &resume.Data.PengalamanKerja,
			&resume.Data.Keterampilan, &resume.Data.BackgroundKandidat); err != nil {
			errors = append(errors, fmt.Sprintf("Error scanning resume: %v", err))
			continue
		}
		resumes = append(resumes, resume)
	}

	// Query jobs
	jobQuery := `SELECT id, nama_pekerjaan, deskripsi_pekerjaan FROM Jobs`
	var jobArgs []interface{}
	if len(reqBody.JobIDs) > 0 {
		jobQuery += " WHERE id = ANY($1)"
		jobArgs = append(jobArgs, reqBody.JobIDs)
	}

	jobRows, err := db.DB.Query(context.Background(), jobQuery, jobArgs...)
	if err != nil {
		http.Error(w, "Error querying jobs: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer jobRows.Close()

	var jobs []struct {
		ID   int
		Data JobData
	}

	for jobRows.Next() {
		var job struct {
			ID   int
			Data JobData
		}
		if err := jobRows.Scan(&job.ID, &job.Data.NamaPekerjaan, &job.Data.DeskripsiPekerjaan); err != nil {
			errors = append(errors, fmt.Sprintf("Error scanning job: %v", err))
			continue
		}
		jobs = append(jobs, job)
	}

	// Loop untuk setiap kombinasi parsed resume dan job
	for _, resume := range resumes {
		for _, job := range jobs {
			// Cek apakah matching sudah ada di DB
			var count int
			err := db.DB.QueryRow(context.Background(),
				`SELECT COUNT(*) FROM Matching WHERE parsed_resume_id = $1 AND job_id = $2`,
				resume.ID, job.ID).Scan(&count)
			if err == nil && count > 0 {
				continue
			}

			// Buat request ke FastAPI
			fastAPIReq := SpecificJobRequest{
				KandidatID: resume.ID,
				JobID:      job.ID,
				Kandidat:   resume.Data,
				Job:        job.Data,
			}

			fastAPIResp, err := sendToFastAPI(fastAPIReq, fastAPIURL)
			if err != nil {
				errors = append(errors, fmt.Sprintf("Error calculating similarity for resume %d, job %d: %v",
					resume.ID, job.ID, err))
				continue
			}

			// Simpan matching
			var matchingID int
			err = db.DB.QueryRow(context.Background(),
				`INSERT INTO Matching (parsed_resume_id, job_id, skor_relevansi) VALUES ($1, $2, $3) RETURNING id`,
				resume.ID, job.ID, fastAPIResp.SimilarityScore).Scan(&matchingID)
			if err != nil {
				errors = append(errors, fmt.Sprintf("Error saving matching for resume %d, job %d: %v",
					resume.ID, job.ID, err))
				continue
			}

			results = append(results, map[string]interface{}{
				"matching_id":      matchingID,
				"parsed_resume_id": resume.ID,
				"job_id":           job.ID,
				"similarity_score": fastAPIResp.SimilarityScore,
			})
		}
	}

	response := map[string]interface{}{
		"success_count": len(results),
		"error_count":   len(errors),
		"results":       results,
		"errors":        errors,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Handler original create matching manual
func CreateMatching(w http.ResponseWriter, r *http.Request) {
	var m Matching
	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := db.DB.QueryRow(context.Background(),
		`INSERT INTO Matching (parsed_resume_id, job_id, skor_relevansi) VALUES ($1, $2, $3) RETURNING id`,
		m.ParsedResumeID, m.JobID, m.SkorRelevansi).Scan(&m.ID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(m)
}

// Handler untuk get matching berdasarkan parsed_resume_id (query param)
func GetMatchingByParsedResumeID(w http.ResponseWriter, r *http.Request) {
	parsedResumeIDStr := r.URL.Query().Get("parsed_resume_id")
	if parsedResumeIDStr == "" {
		http.Error(w, "parsed_resume_id query parameter is required", http.StatusBadRequest)
		return
	}

	parsedResumeID, err := strconv.Atoi(parsedResumeIDStr)
	if err != nil {
		http.Error(w, "Invalid parsed_resume_id", http.StatusBadRequest)
		return
	}

	rows, err := db.DB.Query(context.Background(),
		`SELECT id, parsed_resume_id, job_id, skor_relevansi FROM Matching WHERE parsed_resume_id = $1`,
		parsedResumeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var matchings []Matching
	for rows.Next() {
		var m Matching
		if err := rows.Scan(&m.ID, &m.ParsedResumeID, &m.JobID, &m.SkorRelevansi); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		matchings = append(matchings, m)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(matchings)
}
