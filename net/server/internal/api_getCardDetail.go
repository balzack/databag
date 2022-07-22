package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetCardDetail(w http.ResponseWriter, r *http.Request) {

  account, code, err := ParamAgentToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  cardID := mux.Vars(r)["cardID"]

  var slot store.CardSlot
  if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced empty card slot"))
    return
  }

  WriteResponse(w, getCardDetailModel(&slot))
}

