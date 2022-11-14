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

  if code, err := SendPushEvent(card.Account, event); err != nil {
    ErrResponse(w, code, err);
    return;
  }

	WriteResponse(w, nil)
}

//SendPushEvent delivers notification to clients
func SendPushEvent(account store.Account, event string) (int, error) {

  messages := []push{}
  if err := store.DB.Model(&store.Session{}).Select("sessions.push_token, push_events.message_title, push_events.message_body").Joins("left join push_events on push_events.session_id = session.id").Where("sessions.account_id = ? AND session.push_enabled = ? AND push_events.event = ?", account.ID, true, event).Scan(messages).Error; err != nil {
    return http.StatusInternalServerError, err
  }

  // send push notification for each
  for _, message := range messages {
    PrintMsg(message);
  }

  return http.StatusOK, nil
}

