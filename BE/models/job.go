package models

import "time"

type Job struct {
	ID                 int       `json:"id"`
	RecruiterID        int       `json:"recruiter_id"`
	NamaPekerjaan      string    `json:"nama_pekerjaan"`
	DeskripsiPekerjaan string    `json:"deskripsi_pekerjaan"`
	TanggalPosting     time.Time `json:"tanggal_posting"`
}

type JobInput struct {
	RecruiterID        int    `json:"recruiter_id"`
	NamaPekerjaan      string `json:"nama_pekerjaan"`
	DeskripsiPekerjaan string `json:"deskripsi_pekerjaan"`
}
