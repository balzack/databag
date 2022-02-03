package databag

import (
  "testing"
  "github.com/gorilla/websocket"
  "github.com/stretchr/testify/assert"
)

func TestProfileNotification(t *testing.T) {
  var cards []Card
  var revision Revision
  var ws *websocket.Conn
  var err error

  // connect contacts
  _, a, _ := AddTestAccount("profilenotification0")
  _, b, _ := AddTestAccount("profilenotification1")
  aCard, _ := AddTestCard(a, b)
  bCard, _ := AddTestCard(b, a)
  OpenTestCard(a, aCard)
  OpenTestCard(b, bCard)

  // get list of cards
  r, w, _ := NewRequest("GET", "/contact/cards", nil)
  SetBearerAuth(r, a)
  GetCards(w, r)
  assert.NoError(t, ReadResponse(w, &cards))
  assert.Equal(t, len(cards), 1)
  profileRevision := cards[0].CardData.NotifiedProfile

  // app connects websocket
  ws, err = StatusConnection(a, &revision);
  assert.NoError(t, err)
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
  err = StatusRevision(ws, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, cardRevision, revision.Card)

  // get list of cards
  r, w, _ = NewRequest("GET", "/contact/cards", nil)
  SetBearerAuth(r, a)
  GetCards(w, r)
  assert.NoError(t, ReadResponse(w, &cards))
  assert.Equal(t, len(cards), 1)
  assert.NotEqual(t, profileRevision, cards[0].CardData.NotifiedProfile)
}
