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

	r.Route("/api/cv", func(r chi.Router) {
		r.Post("/upload", handlers.UploadCV) // POST /api/cv/upload
		r.Get("/{kandidat_id}", handlers.GetCVByKandidat)
		r.Put("/{cv_id}", handlers.UpdateCV)
	})

	r.Route("/api/parsed_resume", func(r chi.Router) {
		//r.Post("/", handlers.SaveParsedResume)            // POST /api/parsed_resume
		r.Get("/{cv_id}", handlers.GetParsedResumeByCVID) // GET /api/parsed_resume/{cv_id}
		r.Put("/{cv_id}", handlers.UpdateParsedResume)    // PUT /api/parsed_resume/{cv_id}
	})
	r.Route("/api/jobs", func(r chi.Router) {
		r.Post("/", handlers.CreateJob)           // POST /api/jobs
		r.Get("/", handlers.GetAllJobs)           // GET /api/jobs
		r.Get("/{job_id}", handlers.GetJobByID)   // GET /api/jobs/{job_id}
		r.Put("/{job_id}", handlers.UpdateJob)    // PUT /api/jobs/{job_id}
		r.Delete("/{job_id}", handlers.DeleteJob) // DELETE /api/jobs/{job_id}
	})
	r.Route("/api/applications", func(r chi.Router) {
		r.Post("/", handlers.CreateApplication)                          // POST /api/applications
		r.Get("/{application_id}", handlers.GetApplicationsByKandidatID) // GET /api/applications/{application_id}
		r.Delete("/{application_id}", handlers.DeleteApplication)        // DELETE /api/applications/{application_id}
	})
	r.Route("/api/matching", func(r chi.Router) {
		r.Post("/", handlers.CreateMatchingWithSimilarity)
	})
	return r
}
