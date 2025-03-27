package main

import (
	"net/http"

	"github.com/Timotius2005/InfoLoker-BE/api"
	"github.com/Timotius2005/InfoLoker-BE/api/handlers"
	"github.com/Timotius2005/InfoLoker-BE/config"
	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/pkg/logger"
	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

func main() {
	// Load config
	cfg := config.LoadConfig()

	// Initialize logger
	logger.InitLogger(cfg)
	logger.Log.Info("Starting InfoLoker Backend", zap.String("environment", cfg.APP_ENV))

	// Connect to database
	database, err := db.ConnectDB(cfg)
	if err != nil {
		logger.Log.Fatal("Database connection failed", zap.Error(err))
		return
	}
	defer database.Close()

	// Run migrations
	err = db.RunMigrations(cfg)
	if err != nil {
		logger.Log.Fatal("Migration failed", zap.Error(err))
		return
	}
	logger.Log.Info("Migrations applied successfully")

	// Setup router
	r := chi.NewRouter()
	r.Mount("/", api.SetupRoutes())         // Routes utama
	r.Mount("/auth", handlers.AuthRoutes()) // Menambahkan route auth

	// Start server
	port := cfg.PORT
	logger.Log.Info("Server running", zap.String("port", port))
	err = http.ListenAndServe(":"+port, r)
	if err != nil {
		logger.Log.Fatal("Failed to start server: ", zap.Error(err))
	}
}
