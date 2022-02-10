package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "encoding/base64"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func GetCardProfileImage(w http.ResponseWriter, r *http.Request) {
  var data []byte

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }
  cardId := mux.Vars(r)["cardId"]

  var slot store.CardSlot
  if err := store.DB.Preload("Card.Groups").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced missing card"))
    return
  }
  if slot.Card.Image == "" {
    ErrResponse(w, http.StatusNotFound, errors.New("card image not set"))
    return
  }
  data, err = base64.StdEncoding.DecodeString(slot.Card.Image)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, errors.New("invalid card image"))
    return
  }

  w.Header().Set("Content-Type", http.DetectContentType(data))
  w.Write(data);
}

