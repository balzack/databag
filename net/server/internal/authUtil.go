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

func AccountLogin(r *http.Request) (*store.Account, error) {

  // extract request auth
  username, password, ok := r.BasicAuth();
  if !ok || username == "" || password == "" {
    return nil, errors.New("invalid login")
  }

  // find account
  account := &store.Account{}
  if store.DB.Model(&store.Account{}).Where("Username = ?", username).First(&account).Error != nil {
    return nil, errors.New("username not found");
  }

  // compare password
  if bcrypt.CompareHashAndPassword(account.Password, []byte(password)) != nil {
    return nil, errors.New("invalid password");
  }

  return account, nil
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
  target, access, err := ParseToken(token)
  if err != nil {
    return nil, http.StatusBadRequest, err
  }

  // find token record
  var app store.App
  if detail {
    if err := store.DB.Preload("Account.AccountDetail").Where("account_id = ? AND token = ?", target, access).First(&app).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, http.StatusNotFound, err
      } else {
        return nil, http.StatusInternalServerError, err
      }
    }
  } else {
    if err := store.DB.Preload("Account").Where("account_id = ? AND token = ?", target, access).First(&app).Error; err != nil {
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

func ParseToken(token string) (string, string, error) {
  split := strings.Split(token, ".")
  if len(split) != 2 {
    return "", "", errors.New("invalid token format")
  }
  return split[0], split[1], nil
}

func BearerContactToken(r *http.Request, detail bool) (*store.Card, int, error) {

  // parse bearer authentication
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))
  target, access, err := ParseToken(token)
  if err != nil {
    return nil, http.StatusBadRequest, err
  }

  // find token record
  var card store.Card
  if detail {
    if err := store.DB.Preload("Account.AccountDetail").Where("account_id = ? AND in_token = ?", target, access).First(&card).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, http.StatusNotFound, err
      } else {
        return nil, http.StatusInternalServerError, err
      }
    }
  } else {
    if err := store.DB.Preload("Account").Where("account_id = ? AND in_token = ?", target, access).First(&card).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        return nil, http.StatusNotFound, err
      } else {
        return nil, http.StatusInternalServerError, err
      }
    }
  }
  if card.Account.Disabled {
    return nil, http.StatusGone, errors.New("account is inactive")
  }
  if card.Status != APP_CARDCONNECTING && card.Status != APP_CARDCONNECTED {
    return nil, http.StatusUnauthorized, errors.New("invalid connection state")
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
