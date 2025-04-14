package repeater

import (
	"firebase.google.com/go/v4/messaging"
	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
	"net/http"
	"strings"
	"context"
	"log"
)

type route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type routes []route

var FCMClient *messaging.Client
var FCMContext context.Context

//NewRouter allocate router for databag API
func NewRouter() *mux.Router {

	app, err := firebase.NewApp(context.Background(), nil)
  if err != nil {
    log.Fatalf("error initializing app: %v\n", err)
  }

  ctx := context.Background()
        client, err := app.Messaging(ctx)
        if err != nil {
                log.Fatalf("error getting Messaging client: %v\n", err)
        }
	FCMClient = client
	FCMContext = ctx

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range endpoints {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	return router
}

var endpoints = routes{

	route{
		"Notify",
		strings.ToUpper("Post"),
		"/notify",
		Notify,
	},
}

