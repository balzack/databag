package databag

import (
  "errors"
  "net/http"
  "databag/internal/store"
)

type accountUsername struct {
  Username string
}

func GetAccountUsername(w http.ResponseWriter, r *http.Request) {
  var token *store.AccountToken

  if r.Header.Get("Authorization") == "" {
    if available, err := getAvailableAccounts(); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    } else if available == 0 {
      ErrResponse(w, http.StatusUnauthorized, errors.New("no open accounts available"))
      return
    }
  } else {
    var err error
    token, err = BearerAccountToken(r);
    if err != nil || token.TokenType != APP_TOKENCREATE {
      ErrResponse(w, http.StatusUnauthorized, err)
      return
    }
  }

  username := r.URL.Query().Get("name")
  if username == "" {
    ErrResponse(w, http.StatusBadRequest, errors.New("specify a username"))
    return
  }

  var accounts []accountUsername;
  err := store.DB.Model(&store.Account{}).Where("username = ?", username).Find(&accounts).Error
  if err != nil {
    LogMsg("failed to query accounts")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  if len(accounts) == 0 {
    WriteResponse(w, true)
  } else {
    WriteResponse(w, false)
  }
}

