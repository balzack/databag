package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetChannelTopicConfirmed sets confirmation status of topic
func SetChannelTopicConfirmed(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	topicID := params["topicID"]

	var status string
	if err := ParseRequest(r, w, &status); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}
	if !AppTopicStatus(status) {
		ErrResponse(w, http.StatusBadRequest, errors.New("unknown status"))
		return
	}

	channelSlot, _, code, err := getChannelSlot(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
	act := &channelSlot.Account

	// load topic
	var topicSlot store.TopicSlot
	if err = store.DB.Preload("Topic").Where("channel_id = ? AND topic_slot_id = ?", channelSlot.Channel.ID, topicID).First(&topicSlot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if topicSlot.Topic == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced empty slot"))
		return
	}

	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Model(&topicSlot.Topic).Update("status", status).Error; res != nil {
			return res
		}
		if res := tx.Model(&topicSlot.Topic).Update("detail_revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&topicSlot).Update("revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&channelSlot.Channel).Update("topic_revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&channelSlot).Update("revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(act).Update("channel_revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		return nil
	})
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	// determine affected contact list
	cards := make(map[string]store.Card)
	for _, member := range channelSlot.Channel.Members {
		cards[member.Card.GUID] = member.Card
	}
	for _, group := range channelSlot.Channel.Groups {
		for _, card := range group.Cards {
			cards[card.GUID] = card
		}
	}

	SetStatus(act)
	for _, card := range cards {
		SetContactChannelNotification(act, &card)
	}
	WriteResponse(w, getTopicModel(&topicSlot))
}
