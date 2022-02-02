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
    ErrResponse(w, http.StatusBadRequest, errors.New("unknown status"))
    return
  }
  if status == APP_CARDCONNECTED && token == "" {
    ErrResponse(w, http.StatusBadRequest, errors.New("connected token not set"))
    return
  }

  // load referenced card
  var card store.Card
  if err := store.DB.Preload("Groups").Where("account_id = ? AND card_id = ?", account.Guid, cardId).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  // update card
  card.DataRevision += 1
  if token != "" {
    card.OutToken = token
  }
  if status == APP_CARDCONNECTING {
    if card.Status != APP_CARDCONNECTING && card.Status != APP_CARDCONNECTED {
      data, err := securerandom.Bytes(APP_TOKENSIZE)
      if err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
      card.InToken = hex.EncodeToString(data)
    }
  }
  card.Status = status

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(&card).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, getCardModel(&card));
}

