package databag

import (
  "bytes"
  "testing"
  "encoding/base64"
  "github.com/stretchr/testify/assert"
)

func TestContactSync(t *testing.T) {
  var profile Profile
  var msg DataMessage
  var card *Card
  param := map[string]string{}
  var img []byte
  var data []byte
  var hdr map[string][]string
  var res error
  var cards *[]Card
  var cardRevision string
  var detailRevision int64
  var detail CardDetail
  var rev *Revision
  var viewRevision int64

  // setup testing group
  set, err := AddTestGroup("contactsync")
  assert.NoError(t, err)

  // set profile image
  image := "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"
  assert.NoError(t, ApiTestMsg(SetProfileImage, "PUT", "/profile/image",
    nil, image, APP_TOKENAPP, set.A.Token, &profile, nil))

  // sync profile
  assert.NoError(t, ApiTestMsg(GetProfileMessage, "GET", "/profile/message",
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, &msg, nil))
  param["cardId"] = set.B.A.CardId
  assert.NoError(t, ApiTestMsg(SetCardProfile, "PUT", "/contact/cards/{cardId}/profile",
    &param, &msg, APP_TOKENAPP, set.B.Token, &card, nil))
  assert.True(t, card.Data.CardProfile.ImageSet)
  data, hdr, res = ApiTestData(GetCardProfileImage, "GET", "/contact/cards/{cardId}/profile/image",
    &param, &data, APP_TOKENAPP, set.B.Token)
  assert.NoError(t, res)

  // compare retrieved image
  assert.Equal(t, "image/png", hdr["Content-Type"][0])
  img, err = base64.StdEncoding.DecodeString(image)
  assert.NoError(t, err)
  assert.Zero(t, bytes.Compare(img, data))

  // get full card list
  cards = &[]Card{}
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards",
    nil, nil, APP_TOKENAPP, set.B.Token, cards, &hdr))
  cardRevision = hdr["Card-Revision"][0]
  cards = &[]Card{}
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, &hdr))
  cardRevision = hdr["Card-Revision"][0]
  assert.Equal(t, 0, len(*cards))

  // set card notes
  GetTestRevision(set.B.Revisions)
  assert.NoError(t, ApiTestMsg(SetCardNotes, "PUT", "/conact/cards/{cardId}/notes",
    &param, "CardA notes", APP_TOKENAPP, set.B.Token, &detail, nil))
  rev = GetTestRevision(set.B.Revisions)
  cards = &[]Card{}
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, &hdr))
  assert.Equal(t, 1, len(*cards))
  detailRevision = (*cards)[0].Data.DetailRevision

  // clear card notes
  GetTestRevision(set.B.Revisions)
  assert.NoError(t, ApiTestMsg(ClearCardNotes, "DELETE", "/contact/cards/{cardId}/notes",
    &param, nil, APP_TOKENAPP, set.B.Token, &detail, nil))
  assert.NotEqual(t, rev.Card, GetTestRevision(set.B.Revisions).Card)
  cards = &[]Card{}
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, &hdr))
  assert.Equal(t, 1, len(*cards))
  assert.NotEqual(t, detailRevision, (*cards)[0].Data.DetailRevision)

  // remove card from group
  card = &Card{}
  param["cardId"] = set.B.A.CardId
  assert.NoError(t, ApiTestMsg(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil, APP_TOKENAPP, set.B.Token, card, nil))
  viewRevision = card.Data.NotifiedView

  card = &Card{}
  param["cardId"] = set.A.B.CardId
  param["groupId"] = set.A.B.GroupId
  assert.NoError(t, ApiTestMsg(ClearCardGroup, "DELETE", "/contact/cards/{cardId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, card, nil))
  assert.Equal(t, 0, len(card.Data.CardDetail.Groups))
  assert.NotEqual(t, rev.Card, GetTestRevision(set.B.Revisions).Card)

  card = &Card{}
  param["cardId"] = set.B.A.CardId
  assert.NoError(t, ApiTestMsg(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil, APP_TOKENAPP, set.B.Token, card, nil))
  assert.NotEqual(t, viewRevision, card.Data.NotifiedView)
  PrintMsg(card)

}
