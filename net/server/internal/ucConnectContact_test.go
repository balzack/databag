package databag

import (
  "testing"
  "github.com/gorilla/mux"
  "github.com/stretchr/testify/assert"
)

func TestConnectContact(t *testing.T) {
  var card Card
  var msg DataMessage
  var vars map[string]string

  // create some contacts for this test
  access := AddTestContacts(t, "connect", 2)

  // get A identity message
  r, w, _ := NewRequest("GET", "/profile/message", nil)
  SetBearerAuth(r, access[0])
  GetProfileMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // add A card in B
  r, w, _ = NewRequest("POST", "/contact/cards", &msg)
  SetBearerAuth(r, access[1])
  AddCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // update A status to connecting
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[1])
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // get open message to A
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, access[1])
  GetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

PrintMsg(msg)

  // A request B

  // set B card in A

  // get A open message

  // set A card in B

  // accept A

}

