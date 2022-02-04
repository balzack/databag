package databag

import (
  "strconv"
  "net/http"
  "databag/internal/store"
)

func GetCards(w http.ResponseWriter, r *http.Request) {
  var res error
  var cardRevision int64

  card := r.FormValue("cardRevision")
  if card != "" {
    if cardRevision, res = strconv.ParseInt(card, 10, 64); res != nil {
      ErrResponse(w, http.StatusBadRequest, res)
      return
    }
  }

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var slots []store.CardSlot
  if err := store.DB.Preload("Card.Groups.GroupSlot").Where("account_id = ? AND revision > ?", account.ID, cardRevision).Find(&slots).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var response []*Card
  for _, slot := range slots {
    response = append(response, getCardModel(&slot))
  }

  w.Header().Set("Card-Revision", strconv.FormatInt(account.CardRevision, 10))
  WriteResponse(w, response)
}
