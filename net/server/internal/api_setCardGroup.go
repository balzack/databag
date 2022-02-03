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
  var slot store.CardSlot
  if err := store.DB.Preload("Card").Where("account_id = ? AND card_slot_id = ?", account.ID, cardId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Card == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
    return
  }

  // load referenced group
  var groupSlot store.GroupSlot
  if err := store.DB.Preload("Group").Where("account_id = ? AND group_slot_id = ?", account.ID, groupId).First(&groupSlot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if groupSlot.Group == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced deleted group"))
    return
  }

  // save and update revision
  slot.Card.Groups = append(slot.Card.Groups, *groupSlot.Group)
  slot.Card.ViewRevision += 1
  slot.Revision = account.CardRevision + 1
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(&account).Update("card_revision", account.CardRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Save(&slot.Card).Error; res != nil {
      return res
    }
    if res := tx.Preload("CardData.Groups").Save(&slot).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetContactViewNotification(account, slot.Card)
  SetStatus(account)
  WriteResponse(w, getCardModel(&slot))
}


