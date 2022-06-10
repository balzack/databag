package databag

import (
  "bytes"
  "errors"
  "net/http"
  "encoding/json"
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
        node := getStrConfigValue(CONFIG_DOMAIN, "")
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

  var module string
  if notification.Module == APP_NOTIFYPROFILE {
    module = "profile"
  } else if notification.Module == APP_NOTIFYARTICLE {
    module = "article"
  } else if notification.Module == APP_NOTIFYCHANNEL {
    module = "channel"
  } else if notification.Module == APP_NOTIFYVIEW {
    module = "view"
  } else {
    LogMsg("unknown notification type")
    return
  }

  body, err := json.Marshal(notification.Revision);
  if err != nil {
    ErrMsg(err);
    return
  }
  url := "https://" + notification.Node + "/contact/" + module + "/revision?contact=" + notification.Guid + "." + notification.Token
  req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(body))
  if err != nil {
    ErrMsg(err)
    return
  }
  req.Header.Set("Content-Type", "application/json; charset=utf-8")
  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    ErrMsg(err);
  }
  if resp.StatusCode != 200 {
    LogMsg("failed to notify contact");
  }
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
        Guid: card.Guid,
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

// notify single card of article change: 
// for each card of groups in updated artcile data
// for each card of group set or cleared from article (does not update data)
func SetContactArticleNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYARTICLE,
    Guid: card.Guid,
    Token: card.OutToken,
    Revision: account.ArticleRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}

// notify single card of view change: 
// card set or cleared from a group
// for each card in deleted group
func SetContactViewNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYVIEW,
    Guid: card.Guid,
    Token: card.OutToken,
    Revision: card.ViewRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}

// notify single card of channel change:
// for each card in updated channel data
func SetContactChannelNotification(account *store.Account, card *store.Card) {

  if card.Status != APP_CARDCONNECTED {
    return
  }

  // add new notification for card
  notification := &store.Notification{
    Node: card.Node,
    Module: APP_NOTIFYCHANNEL,
    Guid: card.Guid,
    Token: card.OutToken,
    Revision: account.ChannelRevision,
  }

  if res := store.DB.Save(notification).Error; res != nil {
    ErrMsg(res)
  } else {
    notify <- notification
  }
}

