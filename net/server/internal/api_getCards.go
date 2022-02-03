package databag

import (
  "net/http"
  "databag/internal/store"
)

func GetCards(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var slots []store.CardSlot
  if err := store.DB.Preload("Card.Groups.GroupSlot").Where("account_id = ?", account.ID).Find(&slots).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var response []*Card
  for _, slot := range slots {
    response = append(response, getCardModel(&slot))
  }
  WriteResponse(w, response)
}
