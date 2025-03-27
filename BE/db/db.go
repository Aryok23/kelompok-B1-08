package db

import (
	"context"
	"log"

	"github.com/Timotius2005/InfoLoker-BE/config"
	"github.com/Timotius2005/InfoLoker-BE/models"
	"github.com/Timotius2005/InfoLoker-BE/pkg/logger"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

var DB *pgxpool.Pool

// ConnectDB menghubungkan ke database
func ConnectDB(cfg *config.Config) (*pgxpool.Pool, error) {
	connStr := cfg.GetDBConnectionString()

	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		logger.Log.Fatal("Failed to connect to database: ", zap.Error(err))
		return nil, err
	}

	err = pool.Ping(context.Background())
	if err != nil {
		logger.Log.Fatal("Failed to ping database: ", zap.Error(err))
		return nil, err
	}

	logger.Log.Info("Connected to database")
	DB = pool
	return pool, nil
}

// SaveUser menyimpan user ke database
func SaveUser(ctx context.Context, user *models.User) error {
	query := `INSERT INTO Users (id, nama, email, password_hash, oauth_provider, oauth_id, role_users, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`

	_, err := DB.Exec(ctx, query, user.ID, user.Nama, user.Email, user.PasswordHash, user.OAuthProvider, user.OAuthID, user.RoleUsers)
	if err != nil {
		log.Println("Error inserting user:", err)
		return err
	}
	return nil
}

// GetUserByEmail mengambil user berdasarkan email
func GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	query := `SELECT id, nama, email, password_hash, oauth_provider, oauth_id, role_users, created_at, updated_at FROM Users WHERE email = $1`

	err := DB.QueryRow(ctx, query, email).Scan(&user.ID, &user.Nama, &user.Email, &user.PasswordHash, &user.OAuthProvider, &user.OAuthID, &user.RoleUsers, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		log.Println("Error fetching user:", err)
		return nil, err
	}
	return &user, nil
}

// VerifyUser mengupdate status user setelah verifikasi
func VerifyUser(ctx context.Context, email string) error {
	query := `UPDATE Users SET updated_at = NOW() WHERE email = $1`

	_, err := DB.Exec(ctx, query, email)
	if err != nil {
		log.Println("Error updating user verification:", err)
		return err
	}
	return nil
}
