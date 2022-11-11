package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"encoding/json"
	"errors"
  "time"
	"github.com/theckman/go-securerandom"
	"gorm.io/gorm"
	"net/http"
)

//SetAccountAccess creates token to gain access to account
func SetAccountAccess(w http.ResponseWriter, r *http.Request) {

	token, _, res := AccessToken(r)
	if res != nil || token.TokenType != APPTokenReset {
    time.Sleep(APPUsernameWait * time.Millisecond);
		ErrResponse(w, http.StatusUnauthorized, res)
		return
	}
	if token.Account == nil {
		ErrResponse(w, http.StatusUnauthorized, errors.New("invalid reset token"))
		return
	}
	account := token.Account

  // parse authentication token
  appName := r.FormValue("appName")
  appVersion := r.FormValue("appVersion")
  platform := r.FormValue("platform")
  deviceToken := r.FormValue("deviceToken")
  var notifications []string
  if r.FormValue("notifications") != "" {
    if err := json.Unmarshal([]byte(r.FormValue("notifications")), &notifications); err != nil {
      ErrResponse(w, http.StatusBadRequest, errors.New("invalid notification types"));
      return;
    }
  }

	// parse app data
	var appData AppData
	if err := ParseRequest(r, w, &appData); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	// gernate app token
	data, err := securerandom.Bytes(APPTokenSize)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}
	access := hex.EncodeToString(data)

	// create app entry
	session := store.Session{
		AccountID:   account.GUID,
		Token:       access,
    AppName:     appName,
    AppVersion:  appVersion,
    Platform:    platform,
    PushToken:   deviceToken,
	}

	// save app and delete token
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Create(&session).Error; res != nil {
			return res
		}
    for _, notification := range notifications {
      eventType := &store.EventType{}
      eventType.SessionID = session.ID
      eventType.Name = notification
      if res := tx.Save(eventType).Error; res != nil {
        return res
      }
    }
		if res := tx.Delete(token).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

  login := LoginAccess{
    GUID: account.GUID,
    AppToken: account.GUID + "." + access,
    Created:  session.Created,
    PushSupported: getBoolConfigValue(CNFPushSupported, true),
  }

	WriteResponse(w, login)
}
