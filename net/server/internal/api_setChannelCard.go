package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetChannelCard adds contact to channel membership
func SetChannelCard(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	// scan parameters
	params := mux.Vars(r)
	channelID := params["channelID"]
	cardID := params["cardID"]

	// load referenced channel
	var channelSlot store.ChannelSlot
	if err := store.DB.Preload("Channel.Members.Card.CardSlot").Preload("Channel.Groups.GroupSlot").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelID).First(&channelSlot).Error; err != nil {
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

	// load referenced card
	var cardSlot store.CardSlot
	if err := store.DB.Preload("Card.CardSlot").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&cardSlot).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusInternalServerError, err)
		} else {
			ErrResponse(w, http.StatusNotFound, err)
		}
		return
	}
	if cardSlot.Card == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("card has been deleted"))
		return
	}

	// determine contact list
	cards := make(map[string]store.Card)
	for _, member := range channelSlot.Channel.Members {
		cards[member.Card.GUID] = member.Card
	}
	for _, group := range channelSlot.Channel.Groups {
		for _, card := range group.Cards {
			cards[card.GUID] = card
		}
	}
	cards[cardSlot.Card.GUID] = *cardSlot.Card

	// save and update contact revision
	err = store.DB.Transaction(func(tx *gorm.DB) error {
    member := &store.Member{}
    member.ChannelID = channelSlot.Channel.ID
    member.CardID = cardSlot.Card.ID
    member.Channel = channelSlot.Channel
    member.Card = *cardSlot.Card
    member.PushEnabled = true
		if res := tx.Save(member).Error; res != nil {
			return res
		}
    if res := tx.Model(&store.Channel{}).Where("id = ?", channelSlot.Channel.ID).Update("detail_revision", account.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&store.ChannelSlot{}).Where("id = ?", channelSlot.ID).Update("revision", account.ChannelRevision+1).Error; res != nil {
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

	// notify contacts of content change
	SetStatus(account)
	for _, card := range cards {
		SetContactChannelNotification(account, &card)
	}

  video := getBoolConfigValue(CNFEnableVideo, true);
  audio := getBoolConfigValue(CNFEnableAudio, true);
  image := getBoolConfigValue(CNFEnableImage, true);
	WriteResponse(w, getChannelModel(&channelSlot, true, true, image, audio, video))
}
