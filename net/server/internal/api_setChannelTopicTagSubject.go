package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//SetChannelTopicTagSubject sets subject of tag created by invoker
func SetChannelTopicTagSubject(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	channelID := params["channelID"]
	topicID := params["topicID"]
	tagID := params["tagID"]

	var subject Subject
	if err := ParseRequest(r, w, &subject); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	channelSlot, guid, code, err := getChannelSlot(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
	act := &channelSlot.Account

	// load topic
	var tagSlot store.TagSlot
	if err = store.DB.Preload("Tag.Channel.ChannelSlot").Preload("Tag.Topic.TopicSlot").Where("account_id = ? AND tag_slot_id = ?", act.ID, tagID).First(&tagSlot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if tagSlot.Tag == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced empty tag"))
		return
	}
	if tagSlot.Tag.Channel.ChannelSlot.ChannelSlotID != channelID {
		ErrResponse(w, http.StatusNotFound, errors.New("channel tag not found"))
		return
	}
	if tagSlot.Tag.Topic.TopicSlot.TopicSlotID != topicID {
		ErrResponse(w, http.StatusNotFound, errors.New("topic tag not found"))
		return
	}
	if tagSlot.Tag.GUID != guid {
		ErrResponse(w, http.StatusUnauthorized, errors.New("not creator of tag"))
		return
	}

	err = store.DB.Transaction(func(tx *gorm.DB) error {

		if res := tx.Model(tagSlot.Tag).Update("data", subject.Data).Error; res != nil {
			return res
		}
		if res := tx.Model(tagSlot.Tag).Update("data_type", subject.DataType).Error; res != nil {
			return res
		}
		if res := tx.Model(&tagSlot).Update("revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&tagSlot.Tag.Topic).Update("tag_revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&tagSlot.Tag.Topic.TopicSlot).Update("revision", act.ChannelRevision+1).Error; res != nil {
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
	WriteResponse(w, getTagModel(&tagSlot))
}
