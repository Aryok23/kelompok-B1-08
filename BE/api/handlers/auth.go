package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/models"
	"github.com/Timotius2005/InfoLoker-BE/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles user registration
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var input models.RegisterInput

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Start transaction
	ctx := r.Context()
	tx, err := db.DB.Begin(ctx)
	if err != nil {
		http.Error(w, "Failed to begin transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback(ctx) // rollback kalau ada error

	// Create new user
	newUser := models.User{
		ID:           uuid.New(),
		Nama:         input.Nama,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		RoleUsers:    input.RoleUsers,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Save user ke tabel Users
	_, err = tx.Exec(ctx,
		`INSERT INTO Users (id, nama, email, password_hash, role_users, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		newUser.ID, newUser.Nama, newUser.Email, newUser.PasswordHash,
		newUser.RoleUsers, newUser.CreatedAt, newUser.UpdatedAt,
	)
	if err != nil {
		http.Error(w, "Error saving user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert ke Kandidat atau Recruiter
	switch input.RoleUsers {
	case "kandidat":
		_, err = tx.Exec(ctx,
			`INSERT INTO Kandidat (user_id) VALUES ($1)`,
			newUser.ID,
		)
		if err != nil {
			http.Error(w, "Error saving kandidat: "+err.Error(), http.StatusInternalServerError)
			return
		}
	case "recruiter":
		_, err = tx.Exec(ctx,
			`INSERT INTO Recruiter (user_id, perusahaan) VALUES ($1, $2)`,
			newUser.ID, input.Perusahaan, // Perusahaan harus ada di RegisterInput
		)
		if err != nil {
			http.Error(w, "Error saving recruiter: "+err.Error(), http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "Invalid role_users", http.StatusBadRequest)
		return
	}

	// Commit transaksi
	if err := tx.Commit(ctx); err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}
	if input.RoleUsers == "recruiter" && input.Perusahaan == "" {
		http.Error(w, "Perusahaan wajib diisi untuk recruiter", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User registered successfully"))

	// Generate email verification token
	token, err := utils.GenerateVerificationToken(newUser.Email)
	if err != nil {
		http.Error(w, "Error generating verification token", http.StatusInternalServerError)
		return
	}

	// Send verification email
	err = utils.SendVerificationEmail(newUser.Email, token)
	if err != nil {
		http.Error(w, "Failed to send verification email"+err.Error(), http.StatusInternalServerError)
		return
	}

	// Response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered. Please verify your email."})
}

// Login handles user authentication
func Login(w http.ResponseWriter, r *http.Request) {
	var input models.LoginInput

	// Decode JSON request
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Get user from database
	user, err := db.GetUserByEmail(r.Context(), input.Email)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Compare passwords
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(*user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Response
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// VerifyEmail handles email verification
func VerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")

	if token == "" {
		http.Error(w, "Token required", http.StatusBadRequest)
		return
	}

	email, err := utils.ValidateVerificationToken(token)
	if err != nil {
		http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
		return
	}

	// Update user verification status
	if err := db.VerifyUser(r.Context(), email); err != nil {
		http.Error(w, "Error verifying user", http.StatusInternalServerError)
		return
	}

	// Response
	json.NewEncoder(w).Encode(map[string]string{"message": "Email verified successfully"})
}
func AuthRoutes() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/register", RegisterUser)
	r.Post("/login", Login)
	r.Get("/verify", VerifyEmail)

	return r
}

type RegisterGoogleRequest struct {
	Email         string `json:"email"`
	Nama          string `json:"nama"`
	OauthID       string `json:"oauth_id"`
	OauthProvider string `json:"oauth_provider"`
	RoleUsers     string `json:"role_users"`
}

func RegisterGoogleHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterGoogleRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Cek apakah user sudah ada berdasarkan email atau oauth_id
	var existingID string
	err := db.DB.QueryRow(r.Context(), `
		SELECT id FROM Users 
		WHERE email = $1 OR oauth_id = $2
	`, req.Email, req.OauthID).Scan(&existingID)

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if err == sql.ErrNoRows {
		// Insert user baru
		_, err = db.DB.Exec(r.Context(), `
			INSERT INTO Users (email, nama, oauth_id, oauth_provider, role_users)
			VALUES ($1, $2, $3, $4, $5, '')
		`, req.Email, req.Nama, req.OauthID, req.OauthProvider, req.RoleUsers)

		if err != nil {
			http.Error(w, "Failed to insert user", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}
