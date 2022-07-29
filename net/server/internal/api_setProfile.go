package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//SetProfile updates account public profile details
func SetProfile(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		PrintMsg(r)
		ErrResponse(w, code, err)
		return
	}

	// extract profile data from body
	var profileData ProfileData
	err = ParseRequest(r, w, &profileData)
	if err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	// update record
	account.AccountDetail.Name = profileData.Name
	account.AccountDetail.Location = profileData.Location
	account.AccountDetail.Description = profileData.Description

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Save(&account.AccountDetail).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("profile_revision", account.ProfileRevision+1).Error; res != nil {
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
