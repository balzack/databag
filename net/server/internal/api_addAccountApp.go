package databag

import (
	"databag/internal/store"
	"encoding/hex"
	"github.com/theckman/go-securerandom"
	"gorm.io/gorm"
	"net/http"
)

//AddAccountApp with access token, attach an app to an account generating agent token
func AddAccountApp(w http.ResponseWriter, r *http.Request) {

	account, res := AccountLogin(r)
	if res != nil {
		ErrResponse(w, http.StatusUnauthorized, res)
		return
	}

  // parse authentication token
  appName := r.FormValue("appName")
  appVersion := r.FormValue("appVersion")
  platform := r.FormValue("platform")
  deviceToken := r.FormValue("deviceToken")

	// parse requested notifications
	var notifications []Notification
	if err := ParseRequest(r, w, &notifications); err != nil {
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
