package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/go-chi/chi/v5"
)

type Kandidat struct {
	ID              int    `json:"id"`
	UserID          string `json:"user_id"`
	NamaDepan       string `json:"nama_depan"`
	NamaBelakang    string `json:"nama_belakang"`
	Umur            int    `json:"umur"`
	TanggalLahir    string `json:"tanggal_lahir"` // format: "YYYY-MM-DD"
	Gender          string `json:"gender"`
	BidangPekerjaan string `json:"bidang_pekerjaan"`
}

func UpdateKandidat(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid kandidat ID", http.StatusBadRequest)
		return
	}

	var k Kandidat
	if err := json.NewDecoder(r.Body).Decode(&k); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	query := `
		UPDATE Kandidat
		SET nama_depan = $1,
		    nama_belakang = $2,
		    umur = $3,
		    tanggal_lahir = $4,
		    gender = $5,
		    bidang_pekerjaan = $6
		WHERE id = $7
	`

	_, err = db.DB.Exec(context.Background(), query, k.NamaDepan, k.NamaBelakang, k.Umur, k.TanggalLahir, k.Gender, k.BidangPekerjaan, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	k.ID = id
	json.NewEncoder(w).Encode(k)
}
