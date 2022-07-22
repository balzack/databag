package databag

import (
	"databag/internal/store"
	"net/http"
)

func GetNodeAccounts(w http.ResponseWriter, r *http.Request) {

	if code, err := ParamAdminToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	var accounts []store.Account
	if err := store.DB.Preload("AccountDetail").Find(&accounts).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	profiles := []AccountProfile{}
	for _, account := range accounts {
		profiles = append(profiles, AccountProfile{
			AccountID:   uint32(account.ID),
			GUID:        account.GUID,
			Handle:      account.Username,
			Name:        account.AccountDetail.Name,
			Description: account.AccountDetail.Description,
			Location:    account.AccountDetail.Location,
			ImageSet:    account.AccountDetail.Image != "",
			Disabled:    account.Disabled,
		})
	}

	WriteResponse(w, &profiles)
}
