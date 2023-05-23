package databag

import (
	"databag/internal/store"
	"errors"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
	"net/http"
)

//AddChannelTopicBlock adds a file block asset to a topic
func AddChannelTopicBlock(w http.ResponseWriter, r *http.Request) {

	// scan parameters
	params := mux.Vars(r)
	topicID := params["topicID"]

	channelSlot, guid, code, err := getChannelSlot(r, true)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}
	act := &channelSlot.Account

	// check storage
	if full, err := isStorageFull(act); err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	} else if full {
		ErrResponse(w, http.StatusNotAcceptable, errors.New("storage limit reached"))
		return
	}

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
		ErrResponse(w, http.StatusNotFound, errors.New("referenced empty topic"))
		return
	}

	// can only update topic if creator
	if topicSlot.Topic.GUID != guid {
		ErrResponse(w, http.StatusUnauthorized, errors.New("topic not created by you"))
		return
	}

	// avoid async cleanup of file before record is created
	garbageSync.Lock()
	defer garbageSync.Unlock()

	// save new file
	id := uuid.New().String()
	path := getStrConfigValue(CNFAssetPath, APPDefaultPath) + "/" + channelSlot.Account.GUID + "/" + id
	crc, size, err := saveAsset(r.Body, path)
	if err != nil {
		ErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	asset := &store.Asset{}
	asset.AssetID = id
	asset.AccountID = channelSlot.Account.ID
	asset.ChannelID = channelSlot.Channel.ID
	asset.TopicID = topicSlot.Topic.ID
	asset.Status = APPAssetReady
  asset.Transform = APPTransformCopy
  asset.TransformID = id
	asset.Size = size
	asset.Crc = crc
	err = store.DB.Transaction(func(tx *gorm.DB) error {
		if res := tx.Save(asset).Error; res != nil {
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

  WriteResponse(w, &Asset{AssetID: asset.AssetID, Transform: "_", Status: APPAssetReady})
}

