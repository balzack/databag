package databag

import (
  "errors"
  "strings"
  "time"
	"net/http"
  "encoding/base64"
  "gorm.io/gorm"
  "golang.org/x/crypto/bcrypt"
  "databag/internal/store"
)

type accountLogin struct {
  ID uint
  Guid string
  Password []byte
}

func AdminLogin(r *http.Request) error {

  // extract request auth
  username, password, ok := r.BasicAuth()
  if !ok || username == "" || password == "" {
    return errors.New("invalid credentials")
  }

  // nothing to do if not configured
  if !getBoolConfigValue(CONFIG_CONFIGURED, false) {
    return errors.New("node not configured")
  }

  // compare username
  if getStrConfigValue(CONFIG_USERNAME, "") != username {
    return errors.New("admin username error")
  }

  // compare password
  p := getBinConfigValue(CONFIG_PASSWORD, nil);
  if bcrypt.CompareHashAndPassword(p, []byte(password)) != nil {
    return errors.New("admin password error")
  }

  return nil
}

func AccountLogin(r *http.Request) (uint, error) {

  // extract request auth
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    return 0, errors.New("invalid login")
  }

  // find account
  var account accountLogin
  if store.DB.Model(&store.Account{}).Where("Username = ?", username).First(&account).Error != nil {
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
  if err := store.DB.Preload("Account").Where("token = ?", token).First(&accountToken).Error; err != nil {
    return accountToken, err
  }
  if accountToken.Expires < time.Now().Unix() {
    return accountToken, errors.New("expired token")
  }
  return accountToken, nil
}

func BearerAppToken(r *http.Request, detail bool) (*store.Account, int, error) {

  // parse bearer authentication
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

  // find token record
  var app store.App
  if detail {
    if err := store.DB.Preload("Account.AccountDetail").Where("token = ?", token).First(&app).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, http.StatusNotFound, err
      } else {
        return nil, http.StatusInternalServerError, err
      }
    }
  } else {
    if err := store.DB.Preload("Account").Where("token = ?", token).First(&app).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, http.StatusNotFound, err
      } else {
        return nil, http.StatusInternalServerError, err
      }
    }
  }
  if app.Account.Disabled {
    return nil, http.StatusGone, errors.New("account is inactive")
  }

  return &app.Account, http.StatusOK, nil
}

func BearerContactToken(r *http.Request) (*store.Card, int, error) {

  // parse bearer authentication
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

  // find token record
  var card store.Card
  if err := store.DB.Preload("Account").Where("InToken = ?", token).First(&card).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      return nil, http.StatusNotFound, err
    } else {
      return nil, http.StatusInternalServerError, err
    }
  }
  if card.Account.Disabled {
    return nil, http.StatusGone, errors.New("account is inactive")
  }

  return &card, http.StatusOK, nil
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
    return username, password, err
  }

  // parse credentials
  login := strings.Split(string(credentials), ":");
  if login[0] == "" || login[1] == "" {
    return username, password, errors.New("invalid credentials")
  }
  username = login[0]

  // hash password
  password, err = bcrypt.GenerateFromPassword([]byte(login[1]), bcrypt.DefaultCost)
  if err != nil {
    return username, password, err
  }

  return username, password, nil
}
