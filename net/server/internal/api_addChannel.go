package databag

import (
  "net/http"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddChannel(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  slot := &store.ChannelSlot{}
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    channel := &store.Channel{}
    channel.Data = subject.Data
    channel.DataType = subject.DataType
    channel.DetailRevision = account.ChannelRevision + 1
    channel.TopicRevision = account.ChannelRevision + 1
    if res := tx.Save(channel).Error; res != nil {
      return res
    }

    slot.ChannelSlotId = uuid.New().String()
    slot.AccountID = account.ID
    slot.ChannelID = channel.ID
    slot.Revision = account.ChannelRevision + 1
    slot.Channel = channel
    if res := tx.Save(slot).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("channel_revision", account.ChannelRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetStatus(account)
  WriteResponse(w, getChannelModel(slot, true, true))
}


