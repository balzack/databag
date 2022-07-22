package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

func SetChannelGroup(w http.ResponseWriter, r *http.Request) {

	account, code, err := BearerAppToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	channelID := params["channelID"]
	groupID := params["groupID"]

	// load referenced channel
	var channelSlot store.ChannelSlot
	if err := store.DB.Preload("Channel.Cards.CardSlot").Preload("Channel.Groups.GroupSlot").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelID).First(&channelSlot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if channelSlot.Channel == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("channel has been deleted"))
		return
	}

	// load referenced group
	var groupSlot store.GroupSlot
	if err := store.DB.Preload("Group.Cards").Preload("Group.GroupSlot").Where("account_id = ? AND group_slot_id = ?", account.ID, groupID).First(&groupSlot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if groupSlot.Group == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("group has been deleted"))
		return
	}

	// save and update contact revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(&channelSlot.Channel).Association("Groups").Append(groupSlot.Group); res != nil {
			return res
		}
		if res := tx.Model(&channelSlot).Update("revision", account.ChannelRevision+1).Error; res != nil {
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

	// determine contact list
	cards := make(map[string]store.Card)
	for _, group := range channelSlot.Channel.Groups {
		for _, card := range group.Cards {
			cards[card.GUID] = card
		}
	}

	// notify contacts of content change
	SetStatus(account)
	for _, card := range cards {
		SetContactChannelNotification(account, &card)
	}
	WriteResponse(w, getChannelModel(&channelSlot, true, true))
}
