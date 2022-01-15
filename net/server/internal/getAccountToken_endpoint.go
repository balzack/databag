package databag

import (
  "log"
  "strings"
  "errors"
  "net/http"
  "encoding/json"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetAccountToken(w http.ResponseWriter, r *http.Request) {

  // extract token
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

  // lookup token
  var accountToken store.AccountToken
  err := store.DB.Where("token = ?", token).First(&accountToken).Error
  if err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      log.Println("GetAccountToken - token not found");
      w.WriteHeader(http.StatusNotFound)
    } else {
      log.Println("GetAccountToken - failed to retrieve token");
      w.WriteHeader(http.StatusInternalServerError)
    }
    return
  }

  // return token type
  body, err := json.Marshal(accountToken.TokenType);
  if err != nil {
    log.Println("GetNodeConfig - failed to marshal response");
    w.WriteHeader(http.StatusInternalServerError);
    return
  }
  w.Write(body);
  w.Header().Set("Content-Type", "application/json charset=UTF-8")
  w.WriteHeader(http.StatusOK)
}


