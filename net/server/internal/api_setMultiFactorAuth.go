package databag

import (
  "databag/internal/store"
  "github.com/pquerna/otp"
  "github.com/pquerna/otp/totp"
  "gorm.io/gorm"
	"net/http"
  "errors"
  "time"
)

//SetMultiFactorAuth
func SetMultiFactorAuth(w http.ResponseWriter, r *http.Request) {

	account, ret, err := ParamAgentToken(r, true)
	if err != nil {
		ErrResponse(w, ret, err)
		return
	}

  if !account.MFAEnabled {
    ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp not enabled"))
    return;
  }
  code := r.FormValue("code")
  if code == "" {
    ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp code required"))
    return;
  }

  curTime := time.Now().Unix()
  if account.MFAFailedTime + APPMFAFailPeriod > curTime && account.MFAFailedCount > APPMFAFailCount {
    ErrResponse(w, http.StatusTooManyRequests, errors.New("temporarily locked"))
    return;
  }

  mfaAlgorithm := APPMFASHA1
  opts := totp.ValidateOpts{Period: 30, Skew: 1, Digits: otp.DigitsSix, Algorithm: otp.AlgorithmSHA1}
  if valid, _ := totp.ValidateCustom(code, account.MFASecret, time.Now(), opts); !valid {
    mfaAlgorithm = APPMFASHA256
    opts := totp.ValidateOpts{Period: 30, Skew: 1, Digits: otp.DigitsSix, Algorithm: otp.AlgorithmSHA256}
    if valid, _ := totp.ValidateCustom(code, account.MFASecret, time.Now(), opts); !valid {
      err := store.DB.Transaction(func(tx *gorm.DB) error {
        if account.MFAFailedTime + APPMFAFailPeriod > curTime {
          account.MFAFailedCount += 1
          if res := tx.Model(account).Update("mfa_failed_count", account.MFAFailedCount).Error; res != nil {
            return res
          }
        } else {
          account.MFAFailedTime = curTime
          if res := tx.Model(account).Update("mfa_failed_time", account.MFAFailedTime).Error; res != nil {
            return res
          }
          account.MFAFailedCount = 1
          if res := tx.Model(account).Update("mfa_failed_count", account.MFAFailedCount).Error; res != nil {
            return res
          }
        }
        return nil
      })
      if err != nil {
        LogMsg("failed to increment fail count");
      }

      ErrResponse(w, http.StatusUnauthorized, errors.New("invalid code"))
      return
    }
  }

  err = store.DB.Transaction(func(tx *gorm.DB) error {
    account.MFAConfirmed = true
    if res := tx.Model(account).Update("mfa_confirmed", account.MFAConfirmed).Error; res != nil {
      ErrResponse(w, http.StatusInternalServerError, res)
      return res
    }
    account.MFAAlgorithm = mfaAlgorithm;
    if res := tx.Model(account).Update("mfa_algorithm", account.MFAAlgorithm).Error; res != nil {
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
