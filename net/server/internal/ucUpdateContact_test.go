package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

func TestUpdateContact(t *testing.T) {
  var err error
  var set *TestGroup
  var rev *Revision
  var r *Revision
  var msg DataMessage
  var cards []Card
  var detail int64
  var profile int64
  var cardProfile *CardProfile
  var cardDetail *CardDetail

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

  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.Equal(t, set.A.Guid, cards[0].CardData.Guid)
  profile = cards[0].CardData.ProfileRevision
  rev = r

  cardProfile = &CardProfile{}
  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message", nil, nil, APP_TOKENCONTACT, set.B.A.Token, &msg))
  assert.NoError(t, SendEndpointTest(SetCardProfile, "PUT", "/contact/cards/{cardId}/profile", &map[string]string{"cardId":cards[0].CardId}, msg, APP_TOKENAPP, set.B.Token, cardProfile))
  assert.Equal(t, "Namer", cardProfile.Name)

  r = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, rev.Card, r.Card)

  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.Equal(t, set.A.Guid, cards[0].CardData.Guid)
  assert.NotEqual(t, profile, cards[0].CardData.ProfileRevision)
  detail = cards[0].CardData.DetailRevision
  rev = r

  cardDetail = &CardDetail{}
  assert.NoError(t, SendEndpointTest(SetCardNotes, "PUT", "/contact/cards/{cardId}/notes", &map[string]string{"cardId":cards[0].CardId}, "some interesting notes", APP_TOKENAPP, set.B.Token, cardDetail))
  assert.Equal(t, "some interesting notes", cardDetail.Notes)
  r = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, rev.Card, r.Card)
  rev = r

  cardDetail = &CardDetail{}
  assert.NoError(t, SendEndpointTest(ClearCardNotes, "DELETE", "/contact/cards/{cardId}/notes", &map[string]string{"cardId":cards[0].CardId}, nil, APP_TOKENAPP, set.B.Token, cardDetail))
  assert.Equal(t, "", cardDetail.Notes)
  r = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, rev.Card, r.Card)

  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.Equal(t, set.A.Guid, cards[0].CardData.Guid)
  assert.NotEqual(t, detail, cards[0].CardData.DetailRevision)
}
