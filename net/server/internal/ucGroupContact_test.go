package databag

import (
  "time"
  "testing"
  "encoding/json"
  "github.com/gorilla/mux"
  "github.com/gorilla/websocket"
  "github.com/stretchr/testify/assert"
)

func TestGroupContact(t *testing.T) {
  var subject *Subject
  var group Group
  var groups []Group
  var groupRevision int64
  var cardRevision int64
  var revision Revision
  var vars map[string]string
  var cardData CardData
  var contactRevision int64
  var card Card
  var contactCardRevision int64

  // start notification thread
  go SendNotifications()

  // connect contacts
  access := AddTestContacts(t, "groupcontact", 2);
  contact := ConnectTestContacts(t, access[0], access[1])

  // app connects websocket
  wsA := getTestWebsocket()
  announce := Announce{ AppToken: access[0] }
  data, _ := json.Marshal(&announce)
  wsA.WriteMessage(websocket.TextMessage, data)
  wsB := getTestWebsocket()
  announce = Announce{ AppToken: access[1] }
  data, _ = json.Marshal(&announce)
  wsB.WriteMessage(websocket.TextMessage, data)

  // receive revision
  wsA.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsA.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  groupRevision = revision.Group
  wsB.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsB.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  contactRevision = revision.Card

  // add group to conatact 0
  subject = &Subject{
    DataType: "imagroup",
    Data: "group data with name and logo",
  }
  r, w, _ := NewRequest("POST", "/share/groups", subject)
  SetBearerAuth(r, access[0])
  AddGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))

  // receive revision
  wsA.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsA.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, groupRevision, revision.Group)
  cardRevision = revision.Card

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": contact[1].ContactCardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[1])
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  contactCardRevision = card.ContentRevision

  // set contact group
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/groups/{groupId}", nil)
  vars = make(map[string]string)
  vars["groupId"] = group.GroupId
  vars["cardId"] = contact[0].ContactCardId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[0])
  SetCardGroup(w, r)
  assert.NoError(t, ReadResponse(w, &cardData))
  assert.Equal(t, 1, len(cardData.Groups))

  // receive revision
  wsA.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsA.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, cardRevision, revision.Card)
  groupRevision = revision.Group
  wsB.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsB.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, contactRevision, revision.Card)
  contactRevision = revision.Card

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": contact[1].ContactCardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[1])
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  assert.NotEqual(t, contactCardRevision, card.ContentRevision)
  contactCardRevision = card.ContentRevision

  // show group view
  r, w, _ = NewRequest("GET", "/share/groups", nil)
  SetBearerAuth(r, access[0])
  GetGroups(w, r)
  assert.NoError(t, ReadResponse(w, &groups))
  assert.Equal(t, 1, len(groups))

  // update group in conatact 0
  subject = &Subject{
    DataType: "imagroupEDIT",
    Data: "group data with name and logo",
  }
  r, w, _ = NewRequest("POST", "/share/groups", subject)
  vars = make(map[string]string)
  vars["groupId"] = group.GroupId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[0])
  UpdateGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))
  assert.Equal(t, group.DataType, "imagroupEDIT")

  // receive revision
  wsA.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsA.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, groupRevision, revision.Group)
  groupRevision = revision.Group

  // delete group
  r, w, _ = NewRequest("DELETE", "/share/groups", nil)
  vars = make(map[string]string)
  vars["groupId"] = group.GroupId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[0])
  RemoveGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))

  // receive revision
  wsA.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsA.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, groupRevision, revision.Group)
  wsB.SetReadDeadline(time.Now().Add(2 * time.Second))
  _, data, _ = wsB.ReadMessage()
  assert.NoError(t, json.Unmarshal(data, &revision))
  assert.NotEqual(t, contactRevision, revision.Card)

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": contact[1].ContactCardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[1])
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  assert.NotEqual(t, contactCardRevision, card.ContentRevision)

  // show group view
  r, w, _ = NewRequest("GET", "/share/groups", nil)
  SetBearerAuth(r, access[0])
  GetGroups(w, r)
  assert.NoError(t, ReadResponse(w, &groups))
  assert.Equal(t, 0, len(groups))

  // stop notification thread
  ExitNotifications()
}
