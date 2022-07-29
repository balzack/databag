package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
	"strings"
)

//SetAccountLogin resets account login with agent token
func SetAccountLogin(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	username, password, ret := BasicCredentials(r)
	if ret != nil {
		ErrResponse(w, http.StatusUnauthorized, ret)
		return
	}

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(&account).Update("account_revision", account.AccountRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("profile_revision", account.AccountRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("Username", username).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("Handle", strings.ToLower(username)).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("Password", password).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	SetProfileNotification(account)
	SetStatus(account)
	WriteResponse(w, nil)
}
