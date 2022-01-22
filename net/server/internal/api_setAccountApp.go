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
  if res != nil || token.TokenType != "attach" {
    LogMsg("invalid bearer token")
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  // parse app data
  var appData AppData
  if ParseRequest(r, w, &appData) != nil {
    LogMsg("invalid request data")
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  // gernate app token  
  data, err := securerandom.Bytes(32)
  if err != nil {
    LogMsg("failed to generate token")
    w.WriteHeader(http.StatusInternalServerError);
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
    LogMsg("failed to save app")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  WriteResponse(w, access)
}
