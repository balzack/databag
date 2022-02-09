package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestUpdateProfile(t *testing.T) {
  param := map[string]string{}
  var msg DataMessage
  var card Card
  var bProfileRev int64
  var bCardRev int64
  var cProfileRev int64
  var cCardRev int64

  // setup testing group
  set, err := AddTestGroup("updateprofile")
  assert.NoError(t, err)

  // setup testing group
  _, ret := AddTestGroup("updateprofile")
  assert.Error(t, ret)

  // reset revision
  bCardRev = GetTestRevision(set.B.Revisions).Card
  cCardRev = GetTestRevision(set.C.Revisions).Card

  param["cardId"] = set.B.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.B.Token, &card, nil))
  bProfileRev = card.Data.NotifiedProfile

  param["cardId"] = set.C.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.C.Token, &card, nil))
  cProfileRev = card.Data.NotifiedProfile

  // update A profile
  profileData := &ProfileData{
    Name: "Namer",
    Location: "San Francisco",
    Description: "databaggerr",
  };
  assert.NoError(t, SendEndpointTest(SetProfile, "PUT", "/profile/data",
    nil, profileData,
    APP_TOKENAPP, set.A.Token, nil, nil))

  assert.NotEqual(t, bCardRev, GetTestRevision(set.B.Revisions).Card)
  assert.NotEqual(t, cCardRev, GetTestRevision(set.C.Revisions).Card)

  param["cardId"] = set.B.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.B.Token, &card, nil))
  assert.NotEqual(t, bProfileRev, card.Data.NotifiedProfile)
  assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

  param["cardId"] = set.C.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.C.Token, &card, nil))
  assert.NotEqual(t, cProfileRev, card.Data.NotifiedProfile)
  assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

  // update profile
  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message",
    nil, nil,
    APP_TOKENCONTACT, set.B.A.Token, &msg, nil))
  assert.NoError(t, SendEndpointTest(AddCard, "POST", "/contact/cards",
    nil, &msg,
    APP_TOKENAPP, set.B.Token, &card, nil))
  assert.Equal(t, card.Id, set.B.A.CardId)
  assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
  assert.Equal(t, card.Data.CardProfile.Name, "Namer")

  // update profile
  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message",
    nil, nil,
    APP_TOKENCONTACT, set.C.A.Token, &msg, nil))
  assert.NoError(t, SendEndpointTest(AddCard, "POST", "/contact/cards",
    nil, &msg,
    APP_TOKENAPP, set.C.Token, &card, nil))
  assert.Equal(t, card.Id, set.C.A.CardId)
  assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
  assert.Equal(t, card.Data.CardProfile.Name, "Namer")



}
