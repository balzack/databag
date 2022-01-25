package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetCardGroup(w http.ResponseWriter, r *http.Request) {
  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  cardId := params["cardId"]
  groupId := params["groupId"]


  // load referenced card
  var card store.Card
  if err := store.DB.Where("account_id = ? AND card_id = ?", account.Guid, cardId).First(&card).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  // load referenced group
  var group store.Group
  if err := store.DB.Where("account_id = ? AND group_id = ?", account.ID, groupId).First(&group).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }

  // save and update revision
  card.Groups = append(card.Groups, group)
  card.ViewRevision += 1
  card.DataRevision += 1
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := store.DB.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := store.DB.Preload("Groups").Save(&card).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  cardData := &CardData{
    Revision: card.DataRevision,
    Status: card.Status,
    Notes: card.Notes,
    Token: card.OutToken,
    Groups: nil,
  }
  for _, group := range card.Groups {
    cardData.Groups = append(cardData.Groups, group.GroupId)
  }
  WriteResponse(w, cardData)
  SetContactContentNotification(account, &card)
  SetStatus(account)
}


