package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

func TestAddContact(t *testing.T) {
  var err error
  var set *TestGroup
  var rev *Revision
  var r *Revision
  var msg DataMessage
  var cards []Card
  var card Card

  // setup testing group
  set, err = AddTestGroup("addaccount")
  assert.NoError(t, err)

  // setup testing group
  _, err = AddTestGroup("addaccount")
  assert.Error(t, err)

  rev = GetTestRevision(set.B.Revisions)

  assert.NoError(t, SendEndpointTest(GetCards, "PUT", "/contact/cards", nil, nil, APP_TOKENAPP, set.B.Token, &cards))

  // update B profile
  profileData := ProfileData{
    Name: "Namer",
    Location: "San Francisco",
    Description: "databaggerr",
  };
  assert.NoError(t, SendEndpointTest(SetProfile, "PUT", "/profile/data", nil, &profileData, APP_TOKENAPP, set.A.Token, nil))

  r = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, rev.Card, r.Card)

  assert.NoError(t, SendEndpointTest(GetCards, "PUT", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.Equal(t, set.A.Guid, cards[0].CardData.CardProfile.Guid)
  assert.NotEqual(t, "Namer", cards[0].CardData.CardProfile.Name)
  rev = r

  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message", nil, nil, APP_TOKENCONTACT, set.B.A.Token, &msg))
  assert.NoError(t, SendEndpointTest(SetCardProfile, "PUT", "/contact/cards/{cardId}/profile", &map[string]string{"cardId":cards[0].CardId}, msg, APP_TOKENAPP, set.B.Token, &card))

  r = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, rev.Card, r.Card)

  assert.NoError(t, SendEndpointTest(GetCards, "PUT", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.Equal(t, set.A.Guid, cards[0].CardData.CardProfile.Guid)
  assert.Equal(t, "Namer", cards[0].CardData.CardProfile.Name)
  rev = r
}
