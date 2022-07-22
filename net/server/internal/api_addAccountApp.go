package databag

import (
  "net/http"
  "encoding/hex"
  "gorm.io/gorm"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func AddAccountApp(w http.ResponseWriter, r *http.Request) {

  account, res := AccountLogin(r)
  if res != nil {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
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
  app := store.App {
    AccountID: account.GUID,
    Name: appData.Name,
    Description: appData.Description,
    Image: appData.Image,
    Url: appData.Url,
    Token: access,
  };

  // save app and delete token
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := store.DB.Create(&app).Error; res != nil {
      return res;
    }
    return nil;
  });
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  login := LoginAccess {
    AppToken: account.GUID + "." + access,
    Created: app.Created,
  }

  WriteResponse(w, login)
}

