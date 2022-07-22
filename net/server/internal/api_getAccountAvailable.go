package databag

import (
  "net/http"
  "databag/internal/store"
)

func GetAccountAvailable(w http.ResponseWriter, r *http.Request) {

  available, err := getAvailableAccounts()
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, &available)
}

func getAvailableAccounts() (available int64, err error) {

  open := getBoolConfigValue(CNFOpenAccess, true)
  limit := getNumConfigValue(CNFAccountLimit, 16)

  var count int64
  if err = store.DB.Model(&store.Account{}).Count(&count).Error; err != nil {
    return
  }

  if open && limit > count {
    available = limit - count
  }

  return
}
