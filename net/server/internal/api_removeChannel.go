package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//RemoveChannel removes channel from account
func RemoveChannel(w http.ResponseWriter, r *http.Request) {
	var err error
	var code int

	// scan parameters
	params := mux.Vars(r)
	channelID := params["channelID"]

	// validate contact access
	var account *store.Account
	var contact *store.Card
	tokenType := ParamTokenType(r)
	if tokenType == APPTokenAgent {
		account, code, err = ParamAgentToken(r, false)
		if err != nil {
			ErrResponse(w, code, err)
			return
		}
	} else if tokenType == APPTokenContact {
		contact, code, err = ParamContactToken(r, true)
		if err != nil {
			ErrResponse(w, code, err)
			return
		}
		account = &contact.Account
	} else {
		err = errors.New("unknown token type")
		code = http.StatusBadRequest
		ErrResponse(w, code, err)
		return
	}

	// load channel
	var slot store.ChannelSlot
	if err = store.DB.Preload("Channel.Members.Card").Preload("Channel.Groups.Cards").Where("account_id = ? AND channel_slot_id = ?", account.ID, channelID).First(&slot).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ErrResponse(w, http.StatusNotFound, err)
		} else {
			ErrResponse(w, http.StatusInternalServerError, err)
		}
		return
	}
	if slot.Channel == nil {
		ErrResponse(w, http.StatusNotFound, errors.New("referenced empty channel"))
		return
	}

	// determine affected contact list
	cards := make(map[string]store.Card)
	for _, member := range slot.Channel.Members {
		cards[member.Card.GUID] = member.Card
	}
	for _, group := range slot.Channel.Groups {
		for _, card := range group.Cards {
			cards[card.GUID] = card
		}
	}

	if contact == nil {
		err = store.DB.Transaction(func(tx *gorm.DB) error {
			if res := tx.Model(&slot.Channel).Association("Groups").Clear(); res != nil {
				return res
			}
			slot.Channel.Groups = []store.Group{}
      if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Member{}).Error; res != nil {
        return res
      }
			slot.Channel.Members = []store.Member{}
			if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Tag{}).Error; res != nil {
				return res
			}
			if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.TagSlot{}).Error; res != nil {
				return res
			}
			if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Asset{}).Error; res != nil {
				return res
			}
			if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.Topic{}).Error; res != nil {
				return res
			}
			if res := tx.Where("channel_id = ?", slot.Channel.ID).Delete(&store.TopicSlot{}).Error; res != nil {
				return res
			}
			slot.Channel.Topics = []store.Topic{}
			if res := tx.Delete(&slot.Channel).Error; res != nil {
				return res
			}
			slot.Channel = nil
			if res := tx.Model(&slot).Update("channel_id", -1).Error; res != nil {
				return res
			}
			if res := tx.Model(&slot).Update("revision", account.ChannelRevision+1).Error; res != nil {
				return res
			}
			if res := tx.Model(account).Update("channel_revision", account.ChannelRevision+1).Error; res != nil {
				return res
			}
			return nil
		})
		if err != nil {
			ErrResponse(w, http.StatusInternalServerError, err)
			return
		}

		// cleanup file assets
		go garbageCollect(account)
	} else {
		if _, member := cards[contact.GUID]; !member {
			ErrResponse(w, http.StatusNotFound, errors.New("member channel not found"))
			return
		}
		err = store.DB.Transaction(func(tx *gorm.DB) error {
      if res := tx.Where("channel_id = ? AND card_id = ?", slot.Channel.ID, contact.ID).Delete(&store.Member{}).Error; res != nil {
				return res
			}
      if res := tx.Model(&store.Channel{}).Where("id = ?", slot.Channel.ID).Update("detail_revision", account.ChannelRevision+1).Error; res != nil {
        return res
      }
      if res := tx.Model(&store.ChannelSlot{}).Where("id = ?", slot.ID).Update("revision", account.ChannelRevision+1).Error; res != nil {
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
	}

	SetStatus(account)
	for _, card := range cards {
		SetContactChannelNotification(account, &card)
	}
	WriteResponse(w, nil)
}
