package models

import "time"

type CV struct {
	ID            int `gorm:"primaryKey"`
	KandidatID    int
	FileName      string
	FilePath      string
	FileType      string
	TanggalUnggah time.Time
}
