package databag

import (
	"net/http"
  "databag/internal/store"
  "gorm.io/gorm"
)

//Disable multi-factor auth on account
func RemoveMultiFactorAuth(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    account.MFAConfirmed = false
    if res := tx.Model(account).Update("mfa_confirmed", account.MFAConfirmed).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.MFAEnabled = false
    if res := tx.Model(account).Update("mfa_enabled", account.MFAEnabled).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.AccountRevision += 1;
    if res := tx.Model(&account).Update("account_revision", account.AccountRevision).Error; res != nil {
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
