package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetOpenMessage(w http.ResponseWriter, r *http.Request) {

  account, code, res := BearerAppToken(r, true);
  if res != nil {
    ErrResponse(w, code, res)
    return
  }
  detail := account.AccountDetail
  cardId := mux.Vars(r)["cardId"]

  var card store.Card
  if err := store.DB.Where("account_id = ? AND card_id = ?", account.ID, cardId).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  if card.Status != APP_CARDCONNECTING && card.Status != APP_CARDCONNECTED {
    ErrResponse(w, http.StatusMethodNotAllowed, errors.New("invalid card state"))
    return
  }

  connect := &Connect{
    Contact: card.Guid,
    Token: card.InToken,
    ContentRevision: account.ContentRevision + account.ViewRevision + card.ViewRevision,
    ProfileRevision: account.ProfileRevision,
    Handle: account.Username,
    Name: detail.Name,
    Description: detail.Description,
    Location: detail.Location,
    Image: detail.Image,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/",
  }

  msg, err := WriteDataMessage(detail.PrivateKey, detail.PublicKey, detail.KeyType,
    APP_SIGNPKCS1V15, account.Guid, APP_MSGCONNECT, &connect)
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  WriteResponse(w, msg)
}


