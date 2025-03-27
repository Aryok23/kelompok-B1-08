package handlers

import (
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
	w.Write([]byte("Register endpoint hit"))
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

	// Save user to database
	ctx := r.Context()
	if err := db.SaveUser(ctx, &newUser); err != nil {

		http.Error(w, "Error saving user: "+err.Error(), http.StatusInternalServerError)
		return
	}

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
