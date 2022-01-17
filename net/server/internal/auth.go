package databag

import (
  "errors"
  "strings"
	"net/http"
  "encoding/base64"
  "golang.org/x/crypto/bcrypt"
  "databag/internal/store"
)

func adminLogin(r *http.Request) bool {

  // extract request auth
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    return false
  }

  // nothing to do if not configured
  if !getBoolConfigValue(CONFIG_CONFIGURED, false) {
    return false;
  }

  // compare username
  if getStrConfigValue(CONFIG_USERNAME, "") != username {
    return false
  }

  // compare password
  p := getBinConfigValue(CONFIG_PASSWORD, nil);
  if bcrypt.CompareHashAndPassword(p, []byte(password)) != nil {
    return false
  }

  return true;
}

func bearerAccountToken(r *http.Request) (store.AccountToken, error) {

  // parse bearer authentication
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

  // find token record
  var accountToken store.AccountToken
  err := store.DB.Where("token = ?", token).First(&accountToken).Error
  return accountToken, err
}

func basicCredentials(r *http.Request) (string, []byte, error) {

  var username string
  var password []byte

  // parse bearer authentication
  auth := r.Header.Get("Credentials")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Basic"))

  // decode basic auth
  credentials, err := base64.StdEncoding.DecodeString(token)
  if err != nil {
    LogMsg("faield to decode basic credentials");
    return username, password, err
  }

  // parse credentials
  login := strings.Split(string(credentials), ":");
  if login[0] == "" || login[1] == "" {
    LogMsg("failed to parse basic credentials");
    return username, password, errors.New("invalid credentials")
  }
  username = login[0]

  // hash password
  password, err = bcrypt.GenerateFromPassword([]byte(login[1]), bcrypt.DefaultCost)
  if err != nil {
    LogMsg("failed to hash password")
    return username, password, err 
  }

  return username, password, nil
}
