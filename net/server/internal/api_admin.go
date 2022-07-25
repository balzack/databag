package databag

import (
	"net/http"
)

//ImportAccount TODO import account into node
func ImportAccount(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}
