package models

type ParsedResume struct {
	ID                 int    `json:"id"`
	CvID               int    `json:"cv_id"`
	PengalamanKerja    string `json:"pengalaman_kerja"`
	Keterampilan       string `json:"keterampilan"`
	BackgroundKandidat string `json:"background_kandidat"`
}

type ParsedResumeInput struct {
	CvID               int    `json:"cv_id"`
	PengalamanKerja    string `json:"pengalaman_kerja"`
	Keterampilan       string `json:"keterampilan"`
	BackgroundKandidat string `json:"background_kandidat"`
}
