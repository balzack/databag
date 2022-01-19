package databag

import (
  "net/http"
  "gorm.io/gorm"
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

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := store.DB.Save(&detail).Error; res != nil {
      return res
    }
    if res := store.DB.Model(&account).Update("profile_revision", account.ProfileRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    PrintMsg(err)
    LogMsg("failed to store profile")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  SetStatus(account)
  w.Header().Set("Content-Type", "application/json; charset=UTF-8")
  w.WriteHeader(http.StatusOK)
}

