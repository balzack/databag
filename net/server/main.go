package main

import (
	app "databag/internal"
	"databag/internal/store"
	"github.com/gorilla/handlers"
	"log"
	"net/http"
)

func main() {

	store.SetPath("/var/lib/databag/databag.db")

	log.Printf("Server started")

	router := app.NewRouter()

	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})

	log.Fatal(http.ListenAndServe(":7000", handlers.CORS(origins, methods)(router)))
}
