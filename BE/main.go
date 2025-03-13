package main

import (
	"net/http"

	"github.com/Timotius2005/InfoLoker-BE/api"
	"github.com/Timotius2005/InfoLoker-BE/config"
	"github.com/Timotius2005/InfoLoker-BE/db"
	"github.com/Timotius2005/InfoLoker-BE/pkg/logger"
	"go.uber.org/zap"
)

func main() {
	cfg := config.LoadConfig()

	logger.InitLogger(cfg)
	logger.Log.Info("Starting InfoLoker Backend", zap.String("environment", cfg.APP_ENV))

	database, err := db.ConnectDB(cfg)
	if err != nil {
		logger.Log.Fatal("Database connection failed", zap.Error(err))
		return
	}
	defer database.Close()
	err = db.RunMigrations(cfg)
	if err != nil {
		logger.Log.Fatal("Migration failed", zap.Error(err))
		return
	}
	logger.Log.Info("Migrations applied successfully")
	r := api.SetupRoutes()

	port := cfg.PORT
	logger.Log.Info("Server running", zap.String("port", port))
	err = http.ListenAndServe(":"+port, r)
	if err != nil {
		logger.Log.Fatal("Failed to start server: ", zap.Error(err))
	}
}
