package databag

import (
  "errors"
  "net/http"
  "databag/internal/store"
)

func SetAccountAuthentication(w http.ResponseWriter, r *http.Request) {

  token, res := BearerAccountToken(r)
  if res != nil || token.TokenType != APP_ACCOUNTRESET {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
  }
  if token.Account == nil {
    ErrResponse(w, http.StatusUnauthorized, errors.New("invalid reset token"))
    return
  }

  username, password, ret := BasicCredentials(r)
  if ret != nil {
    ErrResponse(w, http.StatusUnauthorized, ret)
    return
  }

  token.Account.Username = username;
  token.Account.Password = password;
  if err := store.DB.Save(token.Account).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, nil)
}


