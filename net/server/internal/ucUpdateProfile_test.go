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
  var profile Profile

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
    APP_TOKENAPP, set.A.Token, &profile, nil))
  assert.Equal(t, "databaggerr", profile.Description)

  // recv websocket event
  assert.NotEqual(t, bCardRev, GetTestRevision(set.B.Revisions).Card)
  assert.NotEqual(t, cCardRev, GetTestRevision(set.C.Revisions).Card)

  // check B notified
  param["cardId"] = set.B.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.B.Token, &card, nil))
  assert.NotEqual(t, bProfileRev, card.Data.NotifiedProfile)
  assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

  // check C notified
  param["cardId"] = set.C.A.CardId
  assert.NoError(t, SendEndpointTest(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil,
    APP_TOKENAPP, set.C.Token, &card, nil))
  assert.NotEqual(t, cProfileRev, card.Data.NotifiedProfile)
  assert.NotEqual(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)

  // sync profile
  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message",
    nil, nil,
    APP_TOKENCONTACT, set.B.A.Token, &msg, nil))
  assert.NoError(t, SendEndpointTest(AddCard, "POST", "/contact/cards",
    nil, &msg,
    APP_TOKENAPP, set.B.Token, &card, nil))
  assert.Equal(t, card.Id, set.B.A.CardId)
  assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
  assert.Equal(t, card.Data.CardProfile.Name, "Namer")

  // sync profile
  assert.NoError(t, SendEndpointTest(GetProfileMessage, "GET", "/profile/message",
    nil, nil,
    APP_TOKENCONTACT, set.C.A.Token, &msg, nil))
  assert.NoError(t, SendEndpointTest(AddCard, "POST", "/contact/cards",
    nil, &msg,
    APP_TOKENAPP, set.C.Token, &card, nil))
  assert.Equal(t, card.Id, set.C.A.CardId)
  assert.Equal(t, card.Data.ProfileRevision, card.Data.NotifiedProfile)
  assert.Equal(t, card.Data.CardProfile.Name, "Namer")

  // set profile image
  image := "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"
  assert.NoError(t, SendEndpointTest(SetProfileImage, "PUT", "/profile/image",
    nil, image,
    APP_TOKENAPP, set.A.Token, &profile, nil))

  // TODO retrieve and validate profile image

}
