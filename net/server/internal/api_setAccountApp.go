package databag

import (
  "net/http"
  "encoding/hex"
  "gorm.io/gorm"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func SetAccountApp(w http.ResponseWriter, r *http.Request) {

  token, res := BearerAccountToken(r);
  if res != nil || token.TokenType != APP_TOKENATTACH {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
  }

  // parse app data
  var appData AppData
  if res = ParseRequest(r, w, &appData); res != nil {
    ErrResponse(w, http.StatusBadRequest, res)
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
    AccountID: token.Account.Guid,
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
    if res := store.DB.Delete(token).Error; res != nil {
      return res;
    }
    return nil;
  });
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, access)
}
