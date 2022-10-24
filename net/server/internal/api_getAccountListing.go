package databag

import (
	"databag/internal/store"
	"net/http"
)

//GetAccountListing retrieves profile list of publicly accessible accounts
func GetAccountListing(w http.ResponseWriter, r *http.Request) {

  filter := r.FormValue("filter")
	var accounts []store.Account
  if filter == "" {
    if err := store.DB.Order("id desc").Limit(16).Preload("AccountDetail").Where("searchable = ? AND disabled = ?", true, false).Find(&accounts).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  } else {
      username := "%" + filter + "%"
      PrintMsg(username);
    if err := store.DB.Order("id desc").Limit(16).Preload("AccountDetail").Where("username LIKE ? AND searchable = ? AND disabled = ?", username, true, false).Find(&accounts).Error; err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  }

	profiles := []CardProfile{}
	for _, account := range accounts {
		profiles = append(profiles, CardProfile{
			GUID:        account.GUID,
			Handle:      account.Username,
			Name:        account.AccountDetail.Name,
			Description: account.AccountDetail.Description,
			Location:    account.AccountDetail.Location,
			ImageSet:    account.AccountDetail.Image != "",
			Version:     APPVersion,
			Node:        getStrConfigValue(CNFDomain, ""),
		})
	}

	WriteResponse(w, &profiles)
}
