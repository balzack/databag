package databag

import (
  "net/http"
  "databag/internal/store"
)

func GetAccountStatus(w http.ResponseWriter, r *http.Request) {

  account, err := AccountLogin(r)
  if err != nil {
    ErrResponse(w, http.StatusUnauthorized, err)
    return
  }

  var assets []store.Asset;
  if err = store.DB.Where("account_id = ?", account.ID).Find(&assets).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // construct response
  status := &AccountStatus{}
  status.StorageAvailable = getNumConfigValue(CONFIG_STORAGE, 0);
  for _, asset := range assets {
    status.StorageUsed += asset.Size
  }
  status.Disabled = account.Disabled
  status.ForwardingAddress = account.Forward
  status.Searchable = account.Searchable

  WriteResponse(w, status)
}



