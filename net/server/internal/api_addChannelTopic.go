package databag

import (
	"databag/internal/store"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
)

//AddChannelTopic adds a topic to a channel through either contact or agent query param
func AddChannelTopic(w http.ResponseWriter, r *http.Request) {

	confirm := r.FormValue("confirm")

	var subject Subject
	if err := ParseRequest(r, w, &subject); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	channelSlot, guid, err, code := getChannelSlot(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
	act := &channelSlot.Account

	topicSlot := &store.TopicSlot{}
	err = store.DB.Transaction(func(tx *gorm.DB) error {

		topicSlot.TopicSlotID = uuid.New().String()
		topicSlot.AccountID = act.ID
		topicSlot.ChannelID = channelSlot.Channel.ID
		topicSlot.Revision = act.ChannelRevision + 1
		if res := tx.Save(topicSlot).Error; res != nil {
			return res
		}

		topic := &store.Topic{}
		topic.AccountID = act.ID
		topic.ChannelID = channelSlot.Channel.ID
		topic.TopicSlotID = topicSlot.ID
		topic.Data = subject.Data
		topic.DataType = subject.DataType
		topic.GUID = guid
		topic.DetailRevision = act.ChannelRevision + 1
		topic.TagRevision = act.ChannelRevision + 1
		if confirm == "true" {
			topic.Status = APPTopicConfirmed
		} else {
			topic.Status = APPTopicUnconfirmed
		}
		if res := tx.Save(topic).Error; res != nil {
			return res
		}

		topicSlot.Topic = topic

		// update parent revision
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
	for _, card := range channelSlot.Channel.Cards {
		cards[card.GUID] = card
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
	WriteResponse(w, getTopicModel(topicSlot))
}
