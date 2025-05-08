package models

import (
	"time"

	"github.com/google/uuid"
)

// User struct untuk tabel `Users`
type User struct {
	ID            uuid.UUID `json:"id"`
	Nama          string    `json:"nama"`
	Email         string    `json:"email"`
	PasswordHash  string    `json:"password_hash"`
	OAuthProvider string    `json:"oauth_provider"`
	OAuthID       string    `json:"oauth_id"`
	RoleUsers     string    `json:"role_users"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// RegisterInput untuk request registrasi user
type RegisterInput struct {
	Nama       string `json:"nama" validate:"required"`
	Email      string `json:"email" validate:"required,email"`
	Password   string `json:"password" validate:"required,min=6"`
	RoleUsers  string `json:"role_users" validate:"required,oneof=kandidat recruiter"`
	Perusahaan string `json:"perusahaan" validate:"required_if=RoleUsers recruiter"`
}

// LoginInput untuk request login
type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
