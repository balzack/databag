package databag

import (
	"databag/internal/store"
	"encoding/hex"
  "encoding/json"
	"github.com/theckman/go-securerandom"
	"gorm.io/gorm"
	"net/http"
  "errors"
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

	login := LoginAccess{
    GUID: account.GUID,
		AppToken: account.GUID + "." + access,
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
      eventType := &store.EventType{}
      eventType.SessionID = session.ID
      eventType.Name = notification
      if res := tx.Save(eventType).Error; res != nil {
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
