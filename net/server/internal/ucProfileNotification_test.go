package databag

import (
  "time"
  "testing"
  "encoding/json"
  "github.com/gorilla/websocket"
  "github.com/stretchr/testify/assert"
)

func TestProfileNotification(t *testing.T) {
  var views []CardView
  var revision Revision
  var data []byte

  // start notifcation thread
  go SendNotifications()

  // connect contacts
  _, a, _ := AddTestAccount("profilenotification0")
  _, b, _ := AddTestAccount("profilenotification1")
  aCard, _ := AddTestCard(a, b)
  bCard, _ := AddTestCard(b, a)
  OpenTestCard(a, aCard)
  OpenTestCard(b, bCard)

  // get views list of cards
  r, w, _ := NewRequest("GET", "/contact/cards/view", nil)
  SetBearerAuth(r, a)
  GetCardView(w, r)
  assert.NoError(t, ReadResponse(w, &views))
  assert.Equal(t, len(views), 1)
  profileRevision := views[0].RemoteProfile

  // app connects websocket
  ws := getTestWebsocket()
  announce := Announce{ AppToken: a }
  data, _ = json.Marshal(&announce)
  ws.WriteMessage(websocket.TextMessage, data)

  // receive revision
  ws.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = ws.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  cardRevision := revision.Card

  // update B profile
  profileData := ProfileData{
    Name: "Namer",
    Location: "San Francisco",
    Description: "databaggerr",
  };
  r, w, _ = NewRequest("PUT", "/profile/data", &profileData)
  SetBearerAuth(r, b)
  SetProfile(w, r)
  assert.NoError(t, ReadResponse(w, nil))

  // receive revision
  ws.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = ws.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, cardRevision, revision.Card)

  // get views list of cards
  r, w, _ = NewRequest("GET", "/contact/cards/view", nil)
  SetBearerAuth(r, a)
  GetCardView(w, r)
  assert.NoError(t, ReadResponse(w, &views))
  assert.Equal(t, len(views), 1)
  assert.NotEqual(t, profileRevision, views[0].RemoteProfile)

  // stop notification thread
  ExitNotifications()
}
