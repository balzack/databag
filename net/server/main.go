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
  var cert string
  var key string
  var transformPath string

  port := ":443"
  storePath := "/var/lib/databag"
  webApp := "/opt/databag/"

  args := os.Args[1:];
  for i := 0; i + 1 < len(args); i += 2 {
    if args[i] == "-s" {
      storePath = args[i + 1]
    } else if args[i] == "-w" {
      webApp = args[i + 1]
    } else if args[i] == "-p" {
      port = ":" + args[i + 1]
    } else if args[i] == "-c" {
      cert = args[i + 1]
    } else if args[i] == "-k" {
      key = args[i + 1]
    } else if args[i] == "-t" {
      transformPath = args[i + 1]
    }
  }

  store.SetPath(storePath, transformPath);
  router := app.NewRouter(webApp)
  origins := handlers.AllowedOrigins([]string{"*"})
  methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})

  if cert != "" && key != "" {
    log.Printf("using args:" + " -s " + storePath + " -w " + webApp + " -p " + port[1:] + " -c " + cert + " -k " + key + " -t " + transformPath)
    log.Fatal(http.ListenAndServeTLS(port, cert, key, handlers.CORS(origins, methods)(router)))
  } else {
    log.Printf("using args:" + " -s " + storePath + " -w " + webApp + " -p " + port[1:] + " -t " + transformPath)
    log.Fatal(http.ListenAndServe(port, handlers.CORS(origins, methods)(router)))
  }
}
