package databag

import (
  "errors"
  "strings"
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func SetAccountAuthentication(w http.ResponseWriter, r *http.Request) {

  token, res := BearerAccountToken(r)
  if res != nil || token.TokenType != APPTokenReset {
    ErrResponse(w, http.StatusUnauthorized, res)
    return
  }
  if token.Account == nil {
    ErrResponse(w, http.StatusUnauthorized, errors.New("invalid reset token"))
    return
  }

  username, password, ret := BasicCredentials(r)
  if ret != nil || username == "" || password == nil || len(password) == 0 {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid credentials"))
    return
  }

  token.Account.Username = username;
  token.Account.Handle = strings.ToLower(username);
  token.Account.Password = password;

  err := store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(token.Account).Error; res != nil {
      return res
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

  WriteResponse(w, nil)
}


