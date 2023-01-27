package databag

import (
	"databag/internal/store"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"net/http"
  "time"
)

//AddChannelTopic adds a topic to a channel through either contact or agent query param
func AddChannelTopic(w http.ResponseWriter, r *http.Request) {

	confirm := r.FormValue("confirm")

	var subject Subject
	if err := ParseRequest(r, w, &subject); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

	channelSlot, guid, code, err := getChannelSlot(r, true)
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
		if res := tx.Model(&store.Channel{}).Where("id = ?", channelSlot.Channel.ID).Update("topic_revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&store.ChannelSlot{}).Where("id = ?", channelSlot.ID).Update("revision", act.ChannelRevision+1).Error; res != nil {
			return res
		}
		if res := tx.Model(&store.Account{}).Where("id = ?", act.ID).Update("channel_revision", act.ChannelRevision+1).Error; res != nil {
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
	notify := make(map[string]store.Card)
	for _, member := range channelSlot.Channel.Members {
		cards[member.Card.GUID] = member.Card
    if member.PushEnabled && member.Card.GUID != guid {
		  notify[member.Card.GUID] = member.Card
    }
	}
	for _, group := range channelSlot.Channel.Groups {
		for _, card := range group.Cards {
			cards[card.GUID] = card
		}
	}

	WriteResponse(w, getTopicModel(topicSlot))

  go func() {
    time.Sleep(25 * time.Millisecond);
    SetStatus(act)
    for _, card := range cards {
      SetContactChannelNotification(act, &card)
    }
    for _, card := range notify {
      SetContactPushNotification(&card, "content.addChannelTopic." + channelSlot.Channel.DataType)
    }
    if act.GUID != guid {
      go SendPushEvent(*act, "content.addChannelTopic." + channelSlot.Channel.DataType)
    }
  }()
}
