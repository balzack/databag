package databag

import (
  "errors"
  "gorm.io/gorm"
  "databag/internal/store"
)

var notify = make(chan *store.Notification, APP_NOTIFYBUFFER)
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
  if err := store.DB.Preload("Account").Preload("CardSlot").Where("in_token = ?", notification.Token).First(&card).Error; err != nil {
    ErrMsg(err)
    return
  }
  if card.Account.Disabled {
    ErrMsg(errors.New("account is inactive"))
    return
  }

  if notification.Module == APP_NOTIFYPROFILE {
    if err := NotifyProfileRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else if notification.Module == APP_NOTIFYARTICLE {
    if err := NotifyArticleRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else if notification.Module == APP_NOTIFYCHANNEL {
    if err := NotifyChannelRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else if notification.Module == APP_NOTIFYVIEW {
    if err := NotifyViewRevision(&card, notification.Revision); err != nil {
      ErrMsg(err)
    }
  } else {
    LogMsg("unknown notification type")
  }
}

func SendRemoteNotification(notification *store.Notification) {
  // TODO send remote notification
}

// notify all cards of profile change
func SetProfileNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.Guid, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Node: card.Node,
        Module: APP_NOTIFYPROFILE,
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

// notify single card of profile revision
func SetContactProfileNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYPROFILE,
    Token: card.OutToken,
    Revision: account.ProfileRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}


// notify all cards of content change
// account.Content incremented by adding, updating, removing article & setting or clearning group or label from article
func SetContentNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.Guid, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Node: card.Node,
        Module: APP_NOTIFYARTICLE,
        Token: card.OutToken,
        Revision: account.ArticleRevision,
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
func SetContactContentNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYARTICLE,
    Token: card.OutToken,
    Revision: account.ArticleRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}


// notify all cards of view change
// account.View incremented by removing a group or label or adding or removing a group from a label
func SetViewNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.Guid, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Node: card.Node,
        Module: APP_NOTIFYVIEW,
        Token: card.OutToken,
        Revision: card.ViewRevision,
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
func SetContactViewNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYVIEW,
    Token: card.OutToken,
    Revision: card.ViewRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}


// notify all cards of label change
// account.Label incremented by adding, updating, removing a label & setting or clearning group from article
func SetLabelNotification(account *store.Account) {

  // select all connected cards
  var cards []store.Card
  if err := store.DB.Where("account_id = ? AND status = ?", account.Guid, APP_CARDCONNECTED).Find(&cards).Error; err != nil {
    ErrMsg(err)
    return
  }

  // add new notification for each card
  err := store.DB.Transaction(func(tx *gorm.DB) error {
    for _, card := range cards {
      notification := &store.Notification{
        Node: card.Node,
        Module: APP_NOTIFYCHANNEL,
        Token: card.OutToken,
        Revision: account.ChannelRevision,
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

// notify single card of label change
// card.Label incremented by adding or removing group from label
func SetContactLabelNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYCHANNEL,
    Token: card.OutToken,
    Revision: account.ChannelRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}


