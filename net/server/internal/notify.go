package databag

import (
  "gorm.io/gorm"
  "databag/internal/store"
)

var notify = make(chan *store.Notification)
var notifyExit = make(chan bool, 1)

func ExitNotifications() {
  notifyExit <- true
}

func SendNotifications() {

  // queue all saved notifications
  var notifications []store.Notification
  if err := store.DB.Find(&notifications).Error; err != nil {
    ErrMsg(err)
  }
  for _, notification := range notifications {
    notify <- &notification
  }

  // send notifications until exit
  for {
    select {
      case notification := <-notify:
        PrintMsg("SENDING")
        PrintMsg(notification)
      case <-notifyExit:
        PrintMsg("EXITING")
    }
  }
}

// notify all cards of profile change
func SetProfileNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.ID, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Url: card.Node + "/contact/profile/revision",
        Token: card.OutToken,
        Revision: account.ProfileRevision,
      }
      if err := tx.Save(notification).Error; err != nil {
        return err
      }
      notify <- notification
    }
    return nil
  })
  if err != nil {
    ErrMsg(err)
  }
}

// notify all cards of content change
// account.Content incremented by adding, updating, removing article
// account.View incremented by removing a group or label or adding or removing a group with label
func SetContentNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.ID, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Url: card.Node + "/contact/content/revision",
        Token: card.OutToken,
        Revision: account.ViewRevision + account.ContentRevision + card.ViewRevision,
      }
      if err := tx.Save(notification).Error; err != nil {
        return err
      }
      notify <- notification
    }
    return nil
  })
  if err != nil {
    ErrMsg(err)
  }
}

// notify single card of content change
// card.View incremented by adding or removing card from group or label
func SetContactContentNotification(account *store.Account, cardId string) {

  // select card if connected
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ? AND card_id = ?", account.ID, APP_CARDCONNECTED, cardId).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Url: card.Node + "/contact/content/revision",
        Token: card.OutToken,
        Revision: account.ViewRevision + account.ContentRevision + card.ViewRevision,
      }
      if err := tx.Save(notification).Error; err != nil {
        return err
      }
      notify <- notification
    }
    return nil
  })
  if err != nil {
    ErrMsg(err)
  }
}



