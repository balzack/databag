package databag

import (
  "errors"
  "gorm.io/gorm"
  "databag/internal/store"
)

var notify = make(chan *store.Notification)
var notifyExit = make(chan bool)

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
        node := "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/"
        if notification.Node == node {
          SendLocalNotification(notification)
        } else {
          SendRemoteNotification(notification)
        }
        if err := store.DB.Delete(&notification).Error; err != nil {
          ErrMsg(err)
        }
      case <-notifyExit:
        return
    }
  }
}

func SendLocalNotification(notification *store.Notification) {

  // pull reference account
  var card store.Card
  if err := store.DB.Preload("Account").Where("in_token = ?", notification.Token).First(&card).Error; err != nil {
    ErrMsg(err)
    return
  }
  if card.Account.Disabled {
    ErrMsg(errors.New("account is inactive"))
    return
  }

  if notification.Module == APP_MODULEPROFILE {
    if err := NotifyProfileRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else if notification.Module == APP_MODULECONTENT {
    if err := NotifyContentRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else {
    LogMsg("unknown notification type")
  }
}

func SendRemoteNotification(notification *store.Notification) {
  PrintMsg(notification)
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
        Node: card.Node,
        Module: APP_MODULEPROFILE,
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
        Node: card.Node,
        Module: APP_MODULECONTENT,
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
        Node: card.Node,
        Module: APP_MODULECONTENT,
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



