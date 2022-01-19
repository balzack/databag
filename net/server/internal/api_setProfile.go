package databag

import (
  "net/http"
  "databag/internal/store"
)

func SetProfile(w http.ResponseWriter, r *http.Request) {

  account, res := BearerAppToken(r, true);
  if res != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }
  if account.Disabled {
    w.WriteHeader(http.StatusGone);
    return
  }
  detail := account.AccountDetail

  // extract profile data from body
  var profileData ProfileData;
  err := ParseRequest(r, w, &profileData)
  if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  // update record
  detail.Name = profileData.Name
  detail.Location = profileData.Location
  detail.Description = profileData.Description
  if store.DB.Save(&detail).Error != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
}

