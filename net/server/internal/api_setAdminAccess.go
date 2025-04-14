package databag

import (
  "encoding/hex"
  "github.com/theckman/go-securerandom"
	"databag/internal/store"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"net/http"
  "github.com/pquerna/otp"
  "github.com/pquerna/otp/totp"
  "errors"
  "time"
)

//SetAdminAccess begins a session for admin access
func SetAdminAccess(w http.ResponseWriter, r *http.Request) {

  // validate login
  if code, err := ParamAdminToken(r); err != nil {
    ErrResponse(w, code, err)
    return
  }

  // check mfa
  curTime := time.Now().Unix()
  failedTime := getNumConfigValue(CNFMFAFailedTime, 0);
  failedCount := getNumConfigValue(CNFMFAFailedCount, 0);
  mfaEnabled := getBoolConfigValue(CNFMFAEnabled, false);
  mfaConfirmed := getBoolConfigValue(CNFMFAConfirmed, false);
  if mfaEnabled && mfaConfirmed {
    if failedTime + APPMFAFailPeriod > curTime && failedCount > APPMFAFailCount {
      ErrResponse(w, http.StatusTooManyRequests, errors.New("temporarily locked"))
      return;
    }

    code := r.FormValue("code")
    if code == "" {
      ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp code required"))
      return;
    }

    secret := getStrConfigValue(CNFMFASecret, "")
    algorithm := getStrConfigValue(CNFMFAAlgorithm, APPMFASHA256)
    mfaAlgorithm := otp.AlgorithmSHA256
    if algorithm == APPMFASHA1 {
      mfaAlgorithm = otp.AlgorithmSHA1
    }
    opts := totp.ValidateOpts{Period: 30, Skew: 1, Digits: otp.DigitsSix, Algorithm: mfaAlgorithm}
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

      ErrResponse(w, http.StatusForbidden, errors.New("invalid code"))
      return
    }
  }

  // gernate app token
  data, err := securerandom.Bytes(APPTokenSize)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  access := hex.EncodeToString(data)

	err = store.DB.Transaction(func(tx *gorm.DB) error {
    // upsert mfa enabled
    if res := tx.Clauses(clause.OnConflict{
      Columns:   []clause.Column{{Name: "config_id"}},
      DoUpdates: clause.AssignmentColumns([]string{"str_value"}),
    }).Create(&store.Config{ConfigID: CNFAdminSession, StrValue: access}).Error; res != nil {
      return res
    }
		return nil
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

  WriteResponse(w, access)
}
