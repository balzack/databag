package databag

import (
	"bytes"
	"databag/internal/store"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
	"net/http"
)

var notify = make(chan *store.Notification, APPNotifyBuffer)
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
			node := getStrConfigValue(CNFDomain, "")
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

	if notification.Module == APPNotifyProfile {
		if err := NotifyProfileRevision(&card, notification.Revision); err != nil {
			ErrMsg(err)
		}
	} else if notification.Module == APPNotifyArticle {
		if err := NotifyArticleRevision(&card, notification.Revision); err != nil {
			ErrMsg(err)
		}
	} else if notification.Module == APPNotifyChannel {
		if err := NotifyChannelRevision(&card, notification.Revision); err != nil {
			ErrMsg(err)
		}
	} else if notification.Module == APPNotifyView {
		if err := NotifyViewRevision(&card, notification.Revision); err != nil {
			ErrMsg(err)
		}
	} else {
		LogMsg("unknown notification type")
	}
}

func SendRemoteNotification(notification *store.Notification) {

	var module string
	if notification.Module == APPNotifyProfile {
		module = "profile"
	} else if notification.Module == APPNotifyArticle {
		module = "article"
	} else if notification.Module == APPNotifyChannel {
		module = "channel"
	} else if notification.Module == APPNotifyView {
		module = "view"
	} else {
		LogMsg("unknown notification type")
		return
	}

	body, err := json.Marshal(notification.Revision)
	if err != nil {
		ErrMsg(err)
		return
	}
	url := "https://" + notification.Node + "/contact/" + module + "/revision?contact=" + notification.GUID + "." + notification.Token
	req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(body))
	if err != nil {
		ErrMsg(err)
		return
	}
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ErrMsg(err)
	}
	if resp.StatusCode != 200 {
		LogMsg("failed to notify contact")
	}
}

// notify all cards of profile change
func SetProfileNotification(account *store.Account) {

	// select all connected cards
	var cards []store.Card
	if err := store.DB.Where("account_id = ? AND status = ?", account.GUID, APPCardConnected).Find(&cards).Error; err != nil {
		ErrMsg(err)
		return
	}

	// add new notification for each card
	err := store.DB.Transaction(func(tx *gorm.DB) error {
		for _, card := range cards {
			notification := &store.Notification{
				Node:     card.Node,
				Module:   APPNotifyProfile,
				GUID:     card.GUID,
				Token:    card.OutToken,
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
// for each card of groups in updated article data
// for each card of group set or cleared from article (does not update data)
func SetContactArticleNotification(account *store.Account, card *store.Card) {

	if card.Status != APPCardConnected {
		return
	}

	// add new notification for card
	notification := &store.Notification{
		Node:     card.Node,
		Module:   APPNotifyArticle,
		GUID:     card.GUID,
		Token:    card.OutToken,
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

	if card.Status != APPCardConnected {
		return
	}

	// add new notification for card
	notification := &store.Notification{
		Node:     card.Node,
		Module:   APPNotifyView,
		GUID:     card.GUID,
		Token:    card.OutToken,
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

	if card.Status != APPCardConnected {
		return
	}

	// add new notification for card
	notification := &store.Notification{
		Node:     card.Node,
		Module:   APPNotifyChannel,
		GUID:     card.GUID,
		Token:    card.OutToken,
		Revision: account.ChannelRevision,
	}

	if res := store.DB.Save(notification).Error; res != nil {
		ErrMsg(res)
	} else {
		notify <- notification
	}
}
