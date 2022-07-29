package databag

import (
	"net/http"
)

//GetProfile retrieve public profile of account holder
func GetProfile(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	WriteResponse(w, getProfileModel(account))
}
