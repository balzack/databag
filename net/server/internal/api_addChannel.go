package databag

import (
	"databag/internal/store"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

//AddChannel adds a channel to account specified by qgent query param
func AddChannel(w http.ResponseWriter, r *http.Request) {

	account, code, err := ParamAgentToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var params ChannelParams
	if err := ParseRequest(r, w, &params); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	cards := []*store.Card{}
	slot := &store.ChannelSlot{}
	err = store.DB.Transaction(func(tx *gorm.DB) error {

		channel := &store.Channel{}
		channel.AccountID = account.ID
		channel.Data = params.Data
		channel.DataType = params.DataType
		channel.DetailRevision = account.ChannelRevision + 1
		channel.TopicRevision = account.ChannelRevision + 1
		if res := tx.Save(channel).Error; res != nil {
			return res
		}

		slot.ChannelSlotID = uuid.New().String()
		slot.AccountID = account.ID
		slot.ChannelID = channel.ID
		slot.Revision = account.ChannelRevision + 1
		slot.Channel = channel
		if res := tx.Save(slot).Error; res != nil {
			return res
		}
		for _, cardID := range params.Cards {
			cardSlot := store.CardSlot{}
			if res := tx.Preload("Card").Where("account_id = ? AND card_slot_id = ?", account.ID, cardID).First(&cardSlot).Error; res != nil {
				return res
			}
      member := &store.Member{}
      member.ChannelID = channel.ID
      member.CardID = cardSlot.Card.ID
      member.Card = *cardSlot.Card
      member.Channel = channel
      member.PushEnabled = true
			if res := tx.Save(member).Error; res != nil {
				return res
			}
			cards = append(cards, cardSlot.Card)
		}

		for _, groupID := range params.Groups {
			groupSlot := store.GroupSlot{}
			if res := tx.Preload("Group").Where("account_id = ? AND group_slot_id = ?", account.ID, groupID).First(&groupSlot).Error; res != nil {
				return res
			}
			if res := tx.Model(&slot.Channel).Association("Groups").Append(groupSlot.Group); res != nil {
				return res
			}
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

	SetStatus(account)
	for _, card := range cards {
		SetContactChannelNotification(account, card)
    SetContactPushNotification(card, "content.addChannel." + params.DataType)
	}

  video := getBoolConfigValue(CNFEnableVideo, true);
  audio := getBoolConfigValue(CNFEnableAudio, true);
  image := getBoolConfigValue(CNFEnableImage, true);
	WriteResponse(w, getChannelModel(slot, true, true, image, audio, video))
}
