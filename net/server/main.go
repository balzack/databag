package main

import (
	"log"
	"net/http"
	app "databag/internal"
  "databag/internal/store"
)

func main() {

  store.SetPath("/opt/databag/db/databag.db");

	log.Printf("Server started")

	router := app.NewRouter()

	log.Fatal(http.ListenAndServe(":7000", router))
}
