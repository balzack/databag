package databag

import (
	"bytes"
	"encoding/base64"
	"errors"
	"net/http"
	"time"
)

//GetProfileImage retreive profile image for account holder
func GetProfileImage(w http.ResponseWriter, r *http.Request) {
	var data []byte

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	if account.AccountDetail.Image == "" {
		ErrResponse(w, http.StatusNotFound, errors.New("profile image not set"))
		return
	}

	data, err = base64.StdEncoding.DecodeString(account.AccountDetail.Image)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, errors.New("profile image not valid"))
		return
	}

	// response with content
	http.ServeContent(w, r, "image", time.Unix(account.Updated, 0), bytes.NewReader(data))
}
