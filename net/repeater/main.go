package main

import (
	app "repeater/internal"
	"github.com/gorilla/handlers"
	"log"
	"net/http"
  "os"
)

func main() {
  var cert string
  var key string

  port := ":7878"

  args := os.Args[1:];
  for i := 0; i + 1 < len(args); i += 2 {
    if args[i] == "-p" {
      port = ":" + args[i + 1]
    } else if args[i] == "-c" {
      cert = args[i + 1]
    } else if args[i] == "-k" {
      key = args[i + 1]
    }
  }

  router := app.NewRouter()
  origins := handlers.AllowedOrigins([]string{"*"})
  headers := handlers.AllowedHeaders([]string{"content-type", "authorization", "credentials"})
  methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})

  if cert != "" && key != "" {
    log.Printf("using args:" + " -p " + port[1:] + " -c " + cert + " -k " + key)
    log.Fatal(http.ListenAndServeTLS(port, cert, key, handlers.CORS(origins, headers, methods)(router)))
  } else {
    log.Printf("using args:" + " -p " + port[1:])
    log.Fatal(http.ListenAndServe(port, handlers.CORS(origins, headers, methods)(router)))
  }
}
