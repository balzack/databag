package databag

import (
  "net/http"
  "databag/internal/store"
)

type accountUsername struct {
  Username string
}

func GetAccountUsername(w http.ResponseWriter, r *http.Request) {

  _, err := bearerAccountToken(r);
  if err != nil {
    LogMsg("authentication failed")
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  username := r.URL.Query().Get("username")
  if username == "" {
    LogMsg("invalid username")
    w.WriteHeader(http.StatusBadRequest)
    return
  }

  var accounts []accountUsername;
  err = store.DB.Model(&store.Account{}).Where("username = ?", username).Find(&accounts).Error
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

