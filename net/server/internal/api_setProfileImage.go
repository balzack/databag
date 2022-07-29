package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//SetProfileImage updates public profile image of account
func SetProfileImage(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		PrintMsg(r)
		ErrResponse(w, code, err)
		return
	}

	var image string
	if err := ParseRequest(r, w, &image); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	account.AccountDetail.Image = image

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := store.DB.Save(&account.AccountDetail).Error; res != nil {
			return res
		}
		if res := store.DB.Model(&account).Update("profile_revision", account.ProfileRevision+1).Error; res != nil {
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
	WriteResponse(w, getProfileModel(account))
}
