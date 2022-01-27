package databag

import (
  "testing"
  "github.com/gorilla/websocket"
  "github.com/gorilla/mux"
  "github.com/stretchr/testify/assert"
)

func TestConnectContact(t *testing.T) {
  var card Card
  var revision Revision
  var msg DataMessage
  var vars map[string]string
  var cardRevision int64
  var contactStatus ContactStatus
  var ws *websocket.Conn
  var err error


  // create some contacts for this test
  _, a, _ := AddTestAccount("connect0")
  _, b, _ := AddTestAccount("connect1")

  // get A identity message
  r, w, _ := NewRequest("GET", "/profile/message", nil)
  r.Header.Add("TokenType", APP_TOKENAPP)
  SetBearerAuth(r, a)
  GetProfileMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // app connects websocket
  ws, err = StatusConnection(b, &revision);
  assert.NoError(t, err)

  // add A card in B
  r, w, _ = NewRequest("POST", "/contact/cards", &msg)
  SetBearerAuth(r, b)
  AddCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // profile revision incremented
  err = StatusRevision(ws, &revision)
  assert.NoError(t, err)
  cardRevision = revision.Card

  // update A status to connecting
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, b)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // card revision incremented
  err = StatusRevision(ws, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, cardRevision, revision.Card)
  cardRevision = revision.Card

  // get open message to A
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, b)
  GetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // set open message in A
  r, w, _ = NewRequest("PUT", "/contact/openMessage", msg)
  SetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &contactStatus))

  // get view of cards in A
  r, w, _ = NewRequest("GET", "/contact/cards/view", nil)
  SetBearerAuth(r, a)
  GetCardView(w, r)
  var views []CardView
  assert.NoError(t, ReadResponse(w, &views))
  assert.Equal(t, len(views), 1)

  // get B card in A
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // update B status to connecting
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // get open message to B
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  GetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // set open message in B
  r, w, _ = NewRequest("PUT", "/contact/openMessage", msg)
  SetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &contactStatus))
  assert.Equal(t, APP_CARDCONNECTED, contactStatus.Status)

  // card revision incremented
  err = StatusRevision(ws, &revision)
  assert.NoError(t, err)
  assert.NotEqual(t, cardRevision, revision.Card)
  cardRevision = revision.Card

  // update B status to connected
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status?token=" + contactStatus.Token, APP_CARDCONNECTED)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, a)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

}

