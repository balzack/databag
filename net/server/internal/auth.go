package databag

import (
  "errors"
  "strings"
  "time"
	"net/http"
  "encoding/base64"
  "golang.org/x/crypto/bcrypt"
  "databag/internal/store"
)

type accountLogin struct {
  ID uint
  Password []byte
  Expires int64
}

func AdminLogin(r *http.Request) bool {

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

func AccountLogin(r *http.Request) (uint, error) {

  // extract request auth
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    return 0, errors.New("invalid login")
  }

  // find account
  var account accountLogin
  if store.DB.Model(&Account{}).Where("Username = ?", username).First(&account).Error != nil {
    return 0, errors.New("username not found");
  }

  // compare password
  if bcrypt.CompareHashAndPassword(account.Password, []byte(password)) != nil {
    return 0, errors.New("invalid password");
  }

  return account.ID, nil
}

func BearerAccountToken(r *http.Request) (store.AccountToken, error) {

  // parse bearer authentication
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

  // find token record
  var accountToken store.AccountToken
  err := store.DB.Where("token = ?", token).First(&accountToken).Error
  if accountToken.Expires < time.Now().Unix() {
    return accountToken, errors.New("expired token")
  }
  return accountToken, err
}

func BasicCredentials(r *http.Request) (string, []byte, error) {

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
