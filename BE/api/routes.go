package api

import (
	"net/http"

	"github.com/Timotius2005/InfoLoker-BE/api/handlers"
	"github.com/Timotius2005/InfoLoker-BE/api/middlewares"
	"github.com/go-chi/chi/v5"
)

func SetupRoutes() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middlewares.LoggingMiddleware)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to InfoLoker Backend services!"))
	})

	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", handlers.RegisterUser)
		r.Post("/login", handlers.Login)
		r.Get("/verify", handlers.VerifyEmail)
	})

	return r
}
