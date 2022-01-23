package databag

import (
  "strings"
  "errors"
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetProfileMessage(w http.ResponseWriter, r *http.Request) {

  // extract token
  tokenType := r.Header.Get("TokenType")
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))
  target, access, err := ParseToken(token)
  if err != nil {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid bearer token"))
    return
  }

  // load account record
  var account *store.Account
  if tokenType == APP_TOKENAPP {
    var app store.App
    if err := store.DB.Preload("Account.AccountDetail").Where("account_id = ? AND token = ?", target, access).First(&app).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err);
      } else {
        ErrResponse(w, http.StatusInternalServerError, err);
      }
      return
    }
    account = &app.Account
  } else if tokenType == APP_TOKENCONTACT {
    var card store.Card
    if err := store.DB.Preload("Account.AccountDetail").Where("account_id = ? AND InToken = ?", target, access).First(&card).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }
    account = &card.Account
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
  }
  detail := &account.AccountDetail

  // check if account is active
  if account.Disabled {
    ErrResponse(w, http.StatusGone, errors.New("account is not active"))
    return
  }

  // generate identity DataMessage
  identity := Identity{
    Revision: account.ProfileRevision,
    Handle: account.Username,
    Name: detail.Name,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/",
  }
  msg, res := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APP_SIGNPKCS1V15, account.Guid, APP_MSGIDENTITY, &identity)
  if res != nil {
    ErrResponse(w, http.StatusInternalServerError, res)
    return
  }

  WriteResponse(w, msg)
}

