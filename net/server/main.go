package main

import (
	app "databag/internal"
	"databag/internal/store"
	"github.com/gorilla/handlers"
	"log"
	"net/http"
  "os"
)

func main() {
  args := os.Args
  if len(args) == 3 {
    port := ":" + args[1]
    store.SetPath(args[2])
    router := app.NewRouter("/opt/databag/web/build")
    origins := handlers.AllowedOrigins([]string{"*"})
    methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})
    log.Fatal(http.ListenAndServe(port, handlers.CORS(origins, methods)(router)))
  } else {
    log.Printf("usage: databag <port> <store path>");
  }
}
