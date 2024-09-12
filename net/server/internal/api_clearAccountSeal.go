package databag

import (
	"databag/internal/store"
	"gorm.io/gorm"
	"net/http"
)

//ClearAccountSeal sets sealing key for channels
func ClearAccountSeal(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

  // update record
  account.AccountDetail.SealSalt = ""
  account.AccountDetail.SealIV = ""
  account.AccountDetail.SealPrivate = ""
  account.AccountDetail.SealPublic = ""

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(&account.AccountDetail).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("profile_revision", account.ProfileRevision+1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("account_revision", account.AccountRevision+1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetProfileNotification(account)
  SetStatus(account)
	WriteResponse(w, nil)
}
