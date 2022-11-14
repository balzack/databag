package databag

import (
	"databag/internal/store"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"
)

//AccountLogin retrieves account specified by username and password
func AccountLogin(r *http.Request) (*store.Account, error) {

	// extract request auth
	username, password, ok := r.BasicAuth()
	if !ok || username == "" || password == "" {
		return nil, errors.New("invalid login")
	}

	// find account
	account := &store.Account{}
	if store.DB.Model(&store.Account{}).Where("Username = ?", username).First(&account).Error != nil {
		return nil, errors.New("username not found")
	}

	// compare password
	if bcrypt.CompareHashAndPassword(account.Password, []byte(password)) != nil {
		return nil, errors.New("invalid password")
	}

	return account, nil
}

//BearerAccountToken retrieves AccountToken object specified by authorization header
func BearerAccountToken(r *http.Request) (*store.AccountToken, error) {

	// parse bearer authentication
	auth := r.Header.Get("Authorization")
	token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))

	// find token record
	var accountToken store.AccountToken
	if err := store.DB.Preload("Account").Where("token = ?", token).First(&accountToken).Error; err != nil {
		return nil, err
	}
	if accountToken.Expires < time.Now().Unix() {
		return nil, errors.New("expired token")
	}
	return &accountToken, nil
}

//AccessToken retrieves AccountToken specified by token query param
func AccessToken(r *http.Request) (*store.AccountToken, int, error) {

	// parse authentication token
	token := r.FormValue("token")
	if token == "" {
		return nil, http.StatusUnauthorized, errors.New("token not set")
	}

	// find token record
	var accountToken store.AccountToken
	if err := store.DB.Preload("Account").Where("token = ?", token).First(&accountToken).Error; err != nil {
		return nil, http.StatusUnauthorized, err
	}
	if accountToken.Expires < time.Now().Unix() {
		return nil, http.StatusUnauthorized, errors.New("expired token")
	}
	return &accountToken, http.StatusOK, nil
}

//ParamAdminToken compares admin token with token query param
func ParamAdminToken(r *http.Request) (int, error) {

	// parse authentication token
	token := r.FormValue("token")
	if token == "" {
		return http.StatusUnauthorized, errors.New("token not set")
	}

	// nothing to do if not configured
	if !getBoolConfigValue(CNFConfigured, false) {
		return http.StatusUnauthorized, errors.New("node not configured")
	}

	// compare password
	value := getStrConfigValue(CNFToken, "")
	if value != token {
		return http.StatusUnauthorized, errors.New("invalid admin token")
	}

	return http.StatusOK, nil
}

//ParamAgentToken retrieves account specified by agent query param
func GetSession(r *http.Request) (*store.Session, int, error) {

  // parse authentication token
  target, access, err := ParseToken(r.FormValue("agent"))
  if err != nil {
    return nil, http.StatusBadRequest, err
  }

  // find session record
  var session store.Session;
  if err := store.DB.Preload("Account").Where("account_id = ? AND token = ?", target, access).Find(&session).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      return nil, http.StatusNotFound, err
    }
    return nil, http.StatusInternalServerError, err
  }

  if session.Account.Disabled {
    return nil, http.StatusGone, errors.New("account is inactive")
  }

  return &session, http.StatusOK, nil
}

//ParamAgentToken retrieves account specified by agent query param
func ParamAgentToken(r *http.Request, detail bool) (*store.Account, int, error) {

	// parse authentication token
	target, access, err := ParseToken(r.FormValue("agent"))
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

  // find session record
  var session store.Session;
  if detail {
    if err := store.DB.Preload("Account.AccountDetail").Where("account_id = ? AND token =?", target, access).Find(&session).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
    }
  } else {
    if err := store.DB.Preload("Account").Where("account_id = ? AND token =?", target, access).Find(&session).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
    }
  }

	if session.Account.Disabled {
		return nil, http.StatusGone, errors.New("account is inactive")
	}

	return &session.Account, http.StatusOK, nil
}

//BearerAppToken retrieves account specified by authorization header
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
			}
			return nil, http.StatusInternalServerError, err
		}
	} else {
		if err := store.DB.Preload("Account").Where("account_id = ? AND token = ?", target, access).First(&app).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
		}
	}
	if app.Account.Disabled {
		return nil, http.StatusGone, errors.New("account is inactive")
	}

	return &app.Account, http.StatusOK, nil
}

//ParseToken separates access token into its guid and random value parts
func ParseToken(token string) (string, string, error) {

	split := strings.Split(token, ".")
	if len(split) != 2 {
		return "", "", errors.New("invalid token format")
	}
	return split[0], split[1], nil
}

//ParamTokenType returns type of access token specified
func ParamTokenType(r *http.Request) string {
	if r.FormValue(APPTokenContact) != "" {
		return APPTokenContact
	}
	if r.FormValue(APPTokenAgent) != "" {
		return APPTokenAgent
	}
	if r.FormValue(APPTokenAttach) != "" {
		return APPTokenAttach
	}
	if r.FormValue(APPTokenCreate) != "" {
		return APPTokenCreate
	}
	if r.FormValue(APPTokenReset) != "" {
		return APPTokenReset
	}
	return ""
}

//ParamContactToken retrieves card specified by contact query param
func ParamContactToken(r *http.Request, detail bool) (*store.Card, int, error) {

	// parse authentication token
	target, access, err := ParseToken(r.FormValue("contact"))
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	// find token record
	var card store.Card
	if detail {
		if err := store.DB.Preload("CardSlot").Preload("Account.AccountDetail").Where("account_id = ? AND in_token = ?", target, access).First(&card).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
		}
	} else {
		if err := store.DB.Preload("CardSlot").Preload("Account").Where("account_id = ? AND in_token = ?", target, access).First(&card).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
		}
	}
	if card.Account.Disabled {
		return nil, http.StatusGone, errors.New("account is inactive")
	}
	if card.Status != APPCardConnecting && card.Status != APPCardConnected {
		return nil, http.StatusUnauthorized, errors.New("invalid connection state")
	}

	return &card, http.StatusOK, nil
}

//BearerContactToken retrieves card specified by authorization header
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
			}
			return nil, http.StatusInternalServerError, err
		}
	} else {
		if err := store.DB.Preload("Account").Where("account_id = ? AND in_token = ?", target, access).First(&card).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, http.StatusNotFound, err
			}
			return nil, http.StatusInternalServerError, err
		}
	}
	if card.Account.Disabled {
		return nil, http.StatusGone, errors.New("account is inactive")
	}
	if card.Status != APPCardConnecting && card.Status != APPCardConnected {
		return nil, http.StatusUnauthorized, errors.New("invalid connection state")
	}

	return &card, http.StatusOK, nil
}

//BasicCredentials extracts username and password set it credentials header
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
	login := strings.Split(string(credentials), ":")
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
