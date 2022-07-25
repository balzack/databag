package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
	"time"
)

//GetAccountListingImage retrieve profile image of publicly accessible account
func GetAccountListingImage(w http.ResponseWriter, r *http.Request) {

	// get referenced account guid
	params := mux.Vars(r)
	guid := params["guid"]

	var account store.Account
	if err := store.DB.Preload("AccountDetail").Where("guid = ? AND searchable = ? AND disabled = ?", guid, true, false).First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}

	if account.AccountDetail.Image == "" {
		ErrResponse(w, http.StatusNotFound, errors.New("image not set"))
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
