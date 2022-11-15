package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//RemoveCard removes card from account
func RemoveCard(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	cardID := params["cardID"]

	// load referenced card
	var slot store.CardSlot
  if err := store.DB.Preload("Card.Groups").Preload("Card.Channels.Members.Card").Preload("Card.Channels.ChannelSlot").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&slot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if slot.Card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
		return
	}

	// cards to update
	cards := make(map[string]*store.Card)

	// save and update contact revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		for _, channel := range slot.Card.Channels {
      if res := tx.Where("card_id = ?", slot.Card.ID).Delete(&store.Member{}).Error; res != nil {
				return res
			}
      if res := tx.Model(&channel).Update("detail_revision", account.ChannelRevision+1).Error; res != nil {
        return res
      }
			if res := tx.Model(&channel.ChannelSlot).Update("revision", account.ChannelRevision+1).Error; res != nil {
				return res
			}
			for _, member := range channel.Members {
				cards[member.Card.GUID] = &member.Card
			}
		}
		if res := tx.Model(&slot.Card).Association("Groups").Clear(); res != nil {
			return res
		}
		if res := tx.Delete(&slot.Card).Error; res != nil {
			return res
		}
		slot.Card = nil
		if res := tx.Model(&slot).Update("card_id", 0).Error; res != nil {
			return res
		}
		if res := tx.Model(&slot).Update("revision", account.CardRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("card_revision", account.CardRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&account).Update("channel_revision", account.ChannelRevision+1).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	for _, card := range cards {
		SetContactChannelNotification(account, card)
	}
	SetStatus(account)
	WriteResponse(w, nil)
}
