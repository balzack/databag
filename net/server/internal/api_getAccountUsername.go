package databag

import (
  "errors"
  "strings"
  "net/http"
  "databag/internal/store"
)

type accountUsername struct {
  Username string
}

func GetAccountUsername(w http.ResponseWriter, r *http.Request) {

  if r.FormValue("token") != "" {
    token, _, res := AccessToken(r)
    if res != nil || token.TokenType != APP_TOKENCREATE {
      ErrResponse(w, http.StatusUnauthorized, res)
      return
    }
  } else {
    if available, err := getAvailableAccounts(); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    } else if available == 0 {
      ErrResponse(w, http.StatusForbidden, errors.New("no open accounts available"))
      return
    }
  }

  username := r.URL.Query().Get("name")
  if username == "" {
    ErrResponse(w, http.StatusBadRequest, errors.New("specify a username"))
    return
  }

  if strings.Contains(username, " ") || strings.Contains(username, "\t") {
    WriteResponse(w, false)
    return
  }

  var accounts []accountUsername;
  if err := store.DB.Model(&store.Account{}).Where("username = ?", username).Find(&accounts).Error; err != nil {
    LogMsg("failed to query accounts")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  if len(accounts) != 0 {
    WriteResponse(w, false)
    return
  }

  handle := strings.ToLower(username);
  if err := store.DB.Model(&store.Account{}).Where("handle = ?", handle).Find(&accounts).Error; err != nil {
    LogMsg("failed to query accounts")
    w.WriteHeader(http.StatusInternalServerError)
    return
  }
  if len(accounts) != 0 {
    WriteResponse(w, false)
    return
  }

  WriteResponse(w, true)
}

