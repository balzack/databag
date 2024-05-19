package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"github.com/theckman/go-securerandom"
  "github.com/pquerna/otp/totp"
  "github.com/pquerna/otp"
	"gorm.io/gorm"
	"net/http"
  "errors"
  "time"
)

//AddAccountApp with access token, attach an app to an account generating agent token
func AddAccountApp(w http.ResponseWriter, r *http.Request) {

	account, res := AccountLogin(r)
	if res != nil {
		ErrResponse(w, http.StatusUnauthorized, res)
		return
	}

  curTime := time.Now().Unix()
  if account.MFAFailedTime + APPMFAFailPeriod > curTime && account.MFAFailedCount > APPMFAFailCount {
    ErrResponse(w, http.StatusTooManyRequests, errors.New("temporarily locked"))
    return;
  }

  if account.MFAEnabled && account.MFAConfirmed {
    code := r.FormValue("code")
    if code == "" {
      ErrResponse(w, http.StatusMethodNotAllowed, errors.New("totp code required"))
      return;
    }

    opts := totp.ValidateOpts{Period: 30, Skew: 1, Digits: otp.DigitsSix, Algorithm: otp.AlgorithmSHA256}
    if valid, _ := totp.ValidateCustom(code, account.MFASecret, time.Now(), opts); !valid {
      err := store.DB.Transaction(func(tx *gorm.DB) error {
        if account.MFAFailedTime + APPMFAFailPeriod > curTime {
          account.MFAFailedCount += 1;
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

      ErrResponse(w, http.StatusForbidden, errors.New("invalid code"))
      return
    }
  }

  // parse authentication token
  appName := r.FormValue("appName")
  appVersion := r.FormValue("appVersion")
  platform := r.FormValue("platform")
  deviceToken := r.FormValue("deviceToken")
  pushType := r.FormValue("pushType")

	// parse requested notifications
	var notifications []Notification
	if err := ParseRequest(r, w, &notifications); err != nil {
    ErrMsg(err);
	}

	// gernate app token
	data, err := securerandom.Bytes(APPTokenSize)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}
	access := hex.EncodeToString(data)

	login := LoginAccess{
    GUID: account.GUID,
		AppToken: account.GUID + "." + access,
    PushSupported: getBoolConfigValue(CNFPushSupported, true),
	}

	// save app and delete token
	err = store.DB.Transaction(func(tx *gorm.DB) error {

    // create session
    session := &store.Session{}
    session.AccountID = account.GUID
    session.Token = access
    session.AppName = appName
    session.AppVersion = appVersion
    session.Platform = platform
    session.PushToken = deviceToken
    session.PushType = pushType
    session.PushEnabled = true
		if res := tx.Save(session).Error; res != nil {
			return res
		}
		login.Created = session.Created

    for _, notification := range notifications {
      pushEvent := &store.PushEvent{}
      pushEvent.SessionID = session.ID
      pushEvent.Event = notification.Event
      pushEvent.MessageTitle = notification.MessageTitle
      pushEvent.MessageBody = notification.MessageBody
      if res := tx.Save(pushEvent).Error; res != nil {
        return res
      }
    }
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	WriteResponse(w, login)
}
