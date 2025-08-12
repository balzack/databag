package databag

import (
	"databag/internal/store"
	"net/http"
)

//GetAccountAvailable return number of accounts available for public creation
func GetAccountAvailable(w http.ResponseWriter, r *http.Request) {

	available, err := getAvailableAccounts()
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, &available)
}

func getAvailableAccounts() (available int64, err error) {

	open := getBoolConfigValue(CNFEnableOpenAccess, false)
	limit := getNumConfigValue(CNFOpenAccessLimit, 0)

	var count int64
	if err = store.DB.Model(&store.Account{}).Count(&count).Error; err != nil {
		return
	}

  if open && (limit == 0 || limit > count) {
		available = limit - count
	}

	return
}
