package databag

import (
  "net/http"
  "databag/internal/store"
)

func GetAccountAvailable(w http.ResponseWriter, r *http.Request) {

  public := r.FormValue("public") == "true"
  open := getBoolConfigValue(CONFIG_OPENACCESS, true)
  limit := getNumConfigValue(CONFIG_ACCOUNTLIMIT, 16)

  var count int64
  if err := store.DB.Model(&store.Account{}).Count(&count).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var available int64
  if (!public || open) && limit > count {
    available = limit - count
  }

  WriteResponse(w, &available)
}

