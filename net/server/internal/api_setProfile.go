package databag

import (
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func SetProfile(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, true);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  detail := account.AccountDetail

  // extract profile data from body
  var profileData ProfileData;
  err = ParseRequest(r, w, &profileData)
  if err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
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
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, nil)
}

