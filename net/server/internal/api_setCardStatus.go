package databag

import (
  "errors"
  "net/http"
  "encoding/hex"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
  "github.com/theckman/go-securerandom"
)

func SetCardStatus(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  cardId := params["cardId"]
  token := r.FormValue("token")
  var status string
  if err := ParseRequest(r, w, &status); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }
  if !AppCardStatus(status) {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // load referenced card
  var card store.Card
  if err := store.DB.Preload("Groups").Where("account_id = ? AND card_id = ?", account.ID, cardId).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  // update card
  card.Status = status
  if token != "" {
    card.OutToken = token
  }
  if status == APP_CARDCONNECTING {
    data, err := securerandom.Bytes(32)
    if err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
    card.InToken = hex.EncodeToString(data)
  }

  if err := store.DB.Save(&card).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // TODO UPDATE CARD REVISION, CONTACT REVISION
  // TODO SET STATUS

  WriteResponse(w, getCardModel(&card));
}

