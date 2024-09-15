package repeater

import (
	"github.com/gorilla/mux"
	"net/http"
	"strings"
)

type route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type routes []route

//NewRouter allocate router for databag API
func NewRouter() *mux.Router {

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

