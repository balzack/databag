package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestConnectContact(t *testing.T) {

  // create some contacts for this test
  access := AddTestContacts(t, "connect", 2)

  // get B identity message
  r, w, _ := NewRequest("GET", "/profile/message", nil)
  SetBearerAuth(r, access[0])
  GetProfileMessage(w, r)
  var msg DataMessage
  assert.NoError(t, ReadResponse(w, &msg))

  // add B card in A
  r, w, _ = NewRequest("POST", "/contact/cards", &msg)
  SetBearerAuth(r, access[1])
  AddCard(w, r)
  var card Card
  assert.NoError(t, ReadResponse(w, &card))

PrintMsg(card)

  // A request B

  // set B card in A

  // get A open message

  // set A card in B

  // accept A

}

