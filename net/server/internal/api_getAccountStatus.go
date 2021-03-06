package databag

import (
	"databag/internal/store"
	"net/http"
)

//GetAccountStatus retrieves account state values
func GetAccountStatus(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var assets []store.Asset
	if err = store.DB.Where("account_id = ?", account.ID).Find(&assets).Error; err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	// construct response
	status := &AccountStatus{}
	status.StorageAvailable = getNumConfigValue(CNFStorage, 0)
	for _, asset := range assets {
		status.StorageUsed += asset.Size
	}
	status.Disabled = account.Disabled
	status.ForwardingAddress = account.Forward
	status.Searchable = account.Searchable

	WriteResponse(w, status)
}
