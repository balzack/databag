package databag

import (
	"databag/internal/store"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
)

//SetNodeAccountStatus sets disabled status of account
func SetNodeAccountStatus(w http.ResponseWriter, r *http.Request) {

	// get referenced account id
	params := mux.Vars(r)
	accountID, res := strconv.ParseUint(params["accountID"], 10, 32)
	if res != nil {
		ErrResponse(w, http.StatusBadRequest, res)
		return
	}

	if code, err := ParamSessionToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	var flag bool
	if err := ParseRequest(r, w, &flag); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	if err := store.DB.Model(store.Account{}).Where("id = ?", accountID).Update("disabled", flag).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, nil)
}
