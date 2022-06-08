package databag

import (
  "errors"
  "net/http"
  "encoding/hex"
  "gorm.io/gorm"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func SetAccountAccess(w http.ResponseWriter, r *http.Request) {

  token, _, res := AccessToken(r)
  if res != nil || token.TokenType != APP_TOKENRESET {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
  }
  if token.Account == nil {
    ErrResponse(w, http.StatusUnauthorized, errors.New("invalid reset token"))
    return
  }
  account := token.Account;

  // parse app data
  var appData AppData
  if err := ParseRequest(r, w, &appData); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // gernate app token  
  data, err := securerandom.Bytes(APP_TOKENSIZE)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }
  access := hex.EncodeToString(data)

  // create app entry
  app := store.App {
    AccountID: account.Guid,
    Name: appData.Name,
    Description: appData.Description,
    Image: appData.Image,
    Url: appData.Url,
    Token: access,
  };

  // save app and delete token
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Create(&app).Error; res != nil {
      return res;
    }
    if res := tx.Save(token.Account).Error; res != nil {
      return res
    }
    if res := tx.Delete(token).Error; res != nil {
      return res
    }
    return nil;
  });
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, account.Guid + "." + access)
}


