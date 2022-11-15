package databag

import (
	"databag/internal/store"
	"net/http"
)

type push struct {
  PushToken string
  MessageTitle string
  MessageBody string
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
    PrintMsg("IN ROW");
    var pushToken string
    var messageTitle string
    var messageBody string
    rows.Scan(&pushToken, &messageTitle, &messageBody)
  }
}

