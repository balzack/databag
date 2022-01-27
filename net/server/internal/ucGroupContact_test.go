package databag

import (
  "testing"
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
  var wsA *websocket.Conn
  var wsB *websocket.Conn
  var err error

  // connect contacts
  _, a, _ := AddTestAccount("groupcontact0")
  _, b, _ := AddTestAccount("groupcontact1")
  aCard, _ := AddTestCard(a, b)
  bCard, _ := AddTestCard(b, a)
  OpenTestCard(a, aCard)
  OpenTestCard(b, bCard)

  // app connects websocket
  wsA, err = StatusConnection(a, &revision);
  assert.NoError(t, err)
  groupRevision = revision.Group
  wsB, err = StatusConnection(b, &revision);
  assert.NoError(t, err)
  contactRevision = revision.Card

  // add group to conatact 0
  subject = &Subject{
    DataType: "imagroup",
    Data: "group data with name and logo",
  }
  r, w, _ := NewRequest("POST", "/share/groups", subject)
  SetBearerAuth(r, a)
  AddGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))

  // receive revision
  err = StatusRevision(wsA, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, groupRevision, revision.Group)
  cardRevision = revision.Card

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": bCard }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, b)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  contactCardRevision = card.ContentRevision

  // set contact group
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/groups/{groupId}", nil)
  vars = make(map[string]string)
  vars["groupId"] = group.GroupId
  vars["cardId"] = aCard 
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  SetCardGroup(w, r)
  assert.NoError(t, ReadResponse(w, &cardData))
  assert.Equal(t, 1, len(cardData.Groups))

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": aCard }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  GetCard(w, r)
  card = Card{}
  assert.NoError(t, ReadResponse(w, &card))
  assert.Equal(t, len(card.CardData.Groups), 1)

  // receive revision
  err = StatusRevision(wsA, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, cardRevision, revision.Card)
  groupRevision = revision.Group
  err = StatusRevision(wsB, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, contactRevision, revision.Card)
  contactRevision = revision.Card

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": bCard }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, b)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  assert.NotEqual(t, contactCardRevision, card.ContentRevision)
  contactCardRevision = card.ContentRevision

  // show group view
  r, w, _ = NewRequest("GET", "/share/groups", nil)
  SetBearerAuth(r, a)
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
  SetBearerAuth(r, a)
  UpdateGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))
  assert.Equal(t, group.DataType, "imagroupEDIT")

  // receive revision
  err = StatusRevision(wsA, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, groupRevision, revision.Group)
  groupRevision = revision.Group

  // delete group
  r, w, _ = NewRequest("DELETE", "/share/groups", nil)
  vars = make(map[string]string)
  vars["groupId"] = group.GroupId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  RemoveGroup(w, r)
  assert.NoError(t, ReadResponse(w, &group))

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": aCard }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  GetCard(w, r)
  card = Card{}
  assert.NoError(t, ReadResponse(w, &card))
  assert.Equal(t, len(card.CardData.Groups), 0)

  // receive revision
  err = StatusRevision(wsA, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, groupRevision, revision.Group)
  err = StatusRevision(wsB, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, contactRevision, revision.Card)

  // get contact revision
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": bCard }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, b)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  assert.NotEqual(t, contactCardRevision, card.ContentRevision)

  // show group view
  r, w, _ = NewRequest("GET", "/share/groups", nil)
  SetBearerAuth(r, a)
  GetGroups(w, r)
  assert.NoError(t, ReadResponse(w, &groups))
  assert.Equal(t, 0, len(groups))
}
