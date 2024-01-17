package databag

import (
	"databag/internal/store"
	"net/http"
  "bytes"
  "encoding/json"
  "errors"
)

type Payload struct {
  Title string `json:"title"`
  Body string `json:"body"`
  Sound string `json:"sound"`
}

type Message struct {
  Notification Payload `json:"notification"`
  To string `json:"to"`
}

//AddPushEvent notify account of event to push notify
func SetPushEvent(w http.ResponseWriter, r *http.Request) {

	card, code, err := ParamContactToken(r, false)
	if err != nil {
		ErrResponse(w, code, err)
		return
	}

	var event string
	if err := ParseRequest(r, w, &event); err != nil {
		ErrResponse(w, http.StatusBadRequest, err)
		return
	}

  SendPushEvent(card.Account, event)
	WriteResponse(w, nil)
}

//SendPushEvent delivers notification to clients
func SendPushEvent(account store.Account, event string) {

  // check if server supports push
  if getBoolConfigValue(CNFPushSupported, true) != true {
    return
  }

  // get all sessions supporting push for specified event
  rows, err := store.DB.Table("sessions").Select("sessions.push_token, sessions.push_type, push_events.message_title, push_events.message_body").Joins("left join push_events on push_events.session_id = sessions.id").Where("sessions.account_id = ? AND sessions.push_enabled = ? AND push_events.event = ?", account.GUID, true, event).Rows();
  if err != nil {
    ErrMsg(err);
    return
  }

  tokens := make(map[string]bool)
  for rows.Next() {
    var pushToken string
    var pushType string
    var messageTitle string
    var messageBody string

    rows.Scan(&pushToken, &pushType, &messageTitle, &messageBody)
    if pushToken == "" || pushToken == "null" {
      continue;
    }

    if _, exists := tokens[pushToken]; !exists {
      tokens[pushToken] = true;

      if pushType == "up" {
        message := []byte(messageTitle);
        req, err := http.NewRequest(http.MethodPost, pushToken, bytes.NewBuffer(message))
        if err != nil {
          ErrMsg(err)
          continue
        }
        client := &http.Client{}
        resp, err := client.Do(req)
        if err != nil {
          ErrMsg(err)
          continue
        }
        if resp.StatusCode != 200 {
          ErrMsg(errors.New("failed to push notification"));
        }
      } else {
        url := "https://fcm.googleapis.com/fcm/send"
        payload := Payload{ Title: messageTitle, Body: messageBody, Sound: "default" };
        message := Message{ Notification: payload, To: pushToken };

        body, err := json.Marshal(message)
        if err != nil {
          ErrMsg(err)
          continue
        }
        req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
        if err != nil {
          ErrMsg(err)
          continue
        }
        req.Header.Set("Content-Type", "application/json; charset=utf-8")
        req.Header.Set("Authorization", "key=AAAAkgDXt8c:APA91bEjH67QpUWU6uAfCIXLqm0kf6AdPNVICZPCcWbmgW9NGYIErAxMDTy4LEbe4ik93Ho4Z-AJNIhr6nXXKC9qKmyKkkYHJWAEVH47_FXBQV6rsoi9ZB_oiuV66XKKAy1V40GmvfaX")
        client := &http.Client{}
        resp, err := client.Do(req)
        if err != nil {
          ErrMsg(err)
          continue
        }
        if resp.StatusCode != 200 {
          ErrMsg(errors.New("failed to push notification"));
        }
      }
    }
  }
}

