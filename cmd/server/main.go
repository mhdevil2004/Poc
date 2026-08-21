package main

import (
	"LOAN/internal/database"
	"LOAN/internal/handlers"
	"LOAN/internal/middleware"
	"LOAN/internal/repository"
	"LOAN/internal/service"
	"log"
	"net/http"
	"os"
	"strings"

	"://github.com"
)

func main() {
	// 1. Load local .env quietly. Inside Docker, variables are injected directly by the host system.
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found; assuming containerized environment variables are injected")
	}

	db, err := database.NewDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.Migrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	loanRepo := repository.NewLoanRepository(db.DB)
	loanService := service.NewLoanService(loanRepo)
	loanHandler := handlers.NewLoanHandler(loanService)
	sdkHandler := handlers.NewSDKHandler(handlers.SDKSecretFromEnv())

	mux := http.NewServeMux()

	mux.HandleFunc("/api/v1/sdk/handshake", sdkHandler.Handshake)
	mux.HandleFunc("/api/v1/sdk/verify", sdkHandler.Verify)

	mux.HandleFunc("/api/loans", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			loanHandler.GetAllLoans(w, r)
		case http.MethodPost:
			loanHandler.CreateLoan(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/api/loans/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/api/loans/" {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		switch r.Method {
		case http.MethodGet:
			loanHandler.GetLoan(w, r)
		case http.MethodPut:
			if strings.HasSuffix(path, "/status") {
				loanHandler.UpdateLoanStatus(w, r)
			} else {
				loanHandler.UpdateLoan(w, r)
			}
		case http.MethodDelete:
			loanHandler.DeleteLoan(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// 2. FIXED: Explicit Liveness validation endpoint (`/healthz`) requested by your TL
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"alive"}`))
	})

	// Kept your original health endpoint for backward compatibility or readiness checks
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy"}`))
	})

	mux.HandleFunc("/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "openapi.yaml")
	})
	mux.HandleFunc("/docs", handlers.SwaggerUI)

	// 3. Ensure the app dynamically reads the port assigned by Docker/Production systems
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default fallback for running locally on your laptop
	}

	handler := middleware.CORS(mux)
	log.Printf("Server starting on port :%s", port)
	
	// 4. Bound correctly to dynamic port without hardcoded "localhost", ensuring Docker can routing traffic
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
