package databag

import (
  "net/http"
  "time"
  "encoding/hex"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func AddAccountApp(w http.ResponseWriter, r *http.Request) {

  id, err := AccountLogin(r)
  if err != nil {
    LogMsg("failed to login")
    w.WriteHeader(http.StatusUnauthorized);
    return
  }

  data, res := securerandom.Bytes(4)
  if res != nil {
    LogMsg("failed to generate token")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  token := hex.EncodeToString(data)

  accountToken := store.AccountToken{
    AccountID: id,
    TokenType: "attach",
    Token: token,
    Expires: time.Now().Unix() + APP_ATTACHEXPIRE,
  };
  if store.DB.Create(&accountToken).Error != nil {
    LogMsg("failed to store token")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  WriteResponse(w, token);
}

