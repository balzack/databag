package databag

import (
	"databag/internal/store"
	"net/http"
)

func GetAccountListing(w http.ResponseWriter, r *http.Request) {

	var accounts []store.Account
	if err := store.DB.Preload("AccountDetail").Where("searchable = ? AND disabled = ?", true, false).Find(&accounts).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
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
