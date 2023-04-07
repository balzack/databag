package main

import (
	app "databag/internal"
	"databag/internal/store"
  "databag/internal/sturn"
	"github.com/gorilla/handlers"
	"log"
	"net/http"
  "os"
)

func main() {

	store.SetPath("/var/lib/databag/databag.db")

	router := app.NewRouter()

	origins := handlers.AllowedOrigins([]string{"*"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"})

  sturn.Listen(5001, 5002, 5101)

  args := os.Args
  if len(args) == 3 {
    port := ":" + args[2]
    path := "/etc/letsencrypt/live/" + args[1]
    log.Printf("starting server at: " + path + " " + port);
    log.Fatal(http.ListenAndServeTLS(port, path + "/fullchain.pem", path + "/privkey.pem", handlers.CORS(origins, methods)(router)))
  } else if len(args) == 2 {
    path := "/etc/letsencrypt/live/" + args[1]
    log.Printf("starting server at: " + path);
    log.Fatal(http.ListenAndServeTLS(":443", path + "/fullchain.pem", path + "/privkey.pem", handlers.CORS(origins, methods)(router)))
  } else {
    log.Printf("starting server");
    log.Fatal(http.ListenAndServe(":7000", handlers.CORS(origins, methods)(router)))
  }

  sturn.Close();
}
