package databag

import (
  "databag/internal/store"
  "github.com/pquerna/otp"
  "github.com/pquerna/otp/totp"
  "gorm.io/gorm"
  "gorm.io/gorm/clause"
	"net/http"
  "errors"
  "time"
)

//SetMultiFactorAuth
func SetAdminMFAuth(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamSessionToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  if !getBoolConfigValue(CNFMFAEnabled, false) {
    ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp not enabled"))
    return;
  }
  code := r.FormValue("code")
  if code == "" {
    ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp code required"))
    return;
  }

  curTime := time.Now().Unix()
  failedTime := getNumConfigValue(CNFMFAFailedTime, 0);
  failedCount := getNumConfigValue(CNFMFAFailedCount, 0);
  if failedTime + APPMFAFailPeriod > curTime && failedCount > APPMFAFailCount {
    ErrResponse(w, http.StatusTooManyRequests, errors.New("temporarily locked"))
    return;
  }

  secret := getStrConfigValue(CNFMFASecret, "");
  opts := totp.ValidateOpts{Period: 30, Skew: 1, Digits: otp.DigitsSix, Algorithm: otp.AlgorithmSHA256}
  if valid, _ := totp.ValidateCustom(code, secret, time.Now(), opts); !valid {
    err := store.DB.Transaction(func(tx *gorm.DB) error {
      if failedTime + APPMFAFailPeriod > curTime {
        if res := tx.Clauses(clause.OnConflict{
          Columns:   []clause.Column{{Name: "config_id"}},
          DoUpdates: clause.AssignmentColumns([]string{"num_value"}),
        }).Create(&store.Config{ConfigID: CNFMFAFailedCount, NumValue: failedCount + 1}).Error; res != nil {
          return res
        }
      } else {
        if res := tx.Clauses(clause.OnConflict{
          Columns:   []clause.Column{{Name: "config_id"}},
          DoUpdates: clause.AssignmentColumns([]string{"num_value"}),
        }).Create(&store.Config{ConfigID: CNFMFAFailedTime, NumValue: curTime}).Error; res != nil {
          return res
        }
        if res := tx.Clauses(clause.OnConflict{
          Columns:   []clause.Column{{Name: "config_id"}},
          DoUpdates: clause.AssignmentColumns([]string{"num_value"}),
        }).Create(&store.Config{ConfigID: CNFMFAFailedCount, NumValue: 1}).Error; res != nil {
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

  err := store.DB.Transaction(func(tx *gorm.DB) error {
    // upsert mfa confirmed
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"bool_value"}),
    }).Create(&store.Config{ConfigID: CNFMFAConfirmed, BoolValue: true}).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

	WriteResponse(w, nil)
}
