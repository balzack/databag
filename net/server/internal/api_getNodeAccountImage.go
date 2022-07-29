package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"time"
)

//GetNodeAccountImage downloads profile image for the admin
func GetNodeAccountImage(w http.ResponseWriter, r *http.Request) {

	// get referenced account id
	params := mux.Vars(r)
	accountID, res := strconv.ParseUint(params["accountID"], 10, 32)
	if res != nil {
		ErrResponse(w, http.StatusBadRequest, res)
		return
	}

	if code, err := ParamAdminToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	var account store.Account
	if err := store.DB.Preload("AccountDetail").First(&account, uint(accountID)).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}

	if account.AccountDetail.Image == "" {
		ErrResponse(w, http.StatusNotFound, errors.New("iamge not set"))
		return
	}

	data, err := base64.StdEncoding.DecodeString(account.AccountDetail.Image)
	if err != nil {
		ErrResponse(w, http.StatusNotFound, errors.New("image not valid"))
		return
	}

	// response with content
	http.ServeContent(w, r, "image", time.Unix(account.Updated, 0), bytes.NewReader(data))
}
