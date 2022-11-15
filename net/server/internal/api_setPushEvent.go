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
  rows, err := store.DB.Table("sessions").Select("sessions.push_token, push_events.message_title, push_events.message_body").Joins("left join push_events on push_events.session_id = sessions.id").Where("sessions.account_id = ? AND sessions.push_enabled = ? AND push_events.event = ?", account.GUID, true, event).Rows();
  if err != nil {
    ErrMsg(err);
    return
  }
  for rows.Next() {
    var pushToken string
    var messageTitle string
    var messageBody string
    rows.Scan(&pushToken, &messageTitle, &messageBody)

    url := "https://fcm.googleapis.com/fcm/send"
    payload := Payload{ Title: messageTitle, Body: messageBody };
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

