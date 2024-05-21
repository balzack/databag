package databag

import (
	"databag/internal/store"
	"net/http"
)

//GetNodeAccounts retrieves profiles of hosted accounts for the admin
func GetNodeAccounts(w http.ResponseWriter, r *http.Request) {

	if code, err := ParamSessionToken(r); err != nil {
		ErrResponse(w, code, err)
		return
	}

	var accounts []store.Account
	if err := store.DB.Preload("Assets").Preload("AccountDetail").Find(&accounts).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	profiles := []AccountProfile{}
	for _, account := range accounts {
    var size int64
    for _, asset := range account.Assets {
      size += asset.Size
    }

		profiles = append(profiles, AccountProfile{
			AccountID:   uint32(account.ID),
			GUID:        account.GUID,
			Handle:      account.Username,
			Name:        account.AccountDetail.Name,
			Description: account.AccountDetail.Description,
			Location:    account.AccountDetail.Location,
			ImageSet:    account.AccountDetail.Image != "",
			Disabled:    account.Disabled,
      StorageUsed: size,
		})
	}

	WriteResponse(w, &profiles)
}
