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
  var groups *[]Group

  // setup testing group
  set, err := AddTestGroup("contactsync")
  assert.NoError(t, err)

  // set profile image
  image := "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"
  assert.NoError(t, APITestMsg(SetProfileImage, "PUT", "/profile/image",
    nil, image, APP_TOKENAGENT, set.A.Token, &profile, nil))

  // sync profile
  assert.NoError(t, APITestMsg(GetProfileMessage, "GET", "/profile/message",
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, &msg, nil))
  param["cardID"] = set.B.A.CardID
  assert.NoError(t, APITestMsg(SetCardProfile, "PUT", "/contact/cards/{cardID}/profile",
    &param, &msg, APP_TOKENAGENT, set.B.Token, &card, nil))
  assert.True(t, card.Data.CardProfile.ImageSet)
  data, hdr, res = APITestData(GetCardProfileImage, "GET", "/contact/cards/{cardID}/profile/image",
    &param, &data, APP_TOKENAGENT, set.B.Token, 0, 0)
  assert.NoError(t, res)

  // compare retrieved image
  assert.Equal(t, "image/png", hdr["Content-Type"][0])
  img, err = base64.StdEncoding.DecodeString(image)
  assert.NoError(t, err)
  assert.Zero(t, bytes.Compare(img, data))

  // get full card list
  cards = &[]Card{}
  assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards",
    nil, nil, APP_TOKENAGENT, set.B.Token, cards, &hdr))
  cardRevision = hdr["Card-Revision"][0]
  cards = &[]Card{}
  assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAGENT, set.B.Token, cards, &hdr))
  cardRevision = hdr["Card-Revision"][0]
  assert.Equal(t, 0, len(*cards)) // ?? actual 1

  // set card notes
  GetTestRevision(set.B.Revisions)
  assert.NoError(t, APITestMsg(SetCardNotes, "PUT", "/conact/cards/{cardID}/notes",
    &param, "CardA notes", APP_TOKENAGENT, set.B.Token, &detail, nil))
  rev = GetTestRevision(set.B.Revisions)
  cards = &[]Card{}
  assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAGENT, set.B.Token, cards, &hdr))
  assert.Equal(t, 1, len(*cards))
  detailRevision = (*cards)[0].Data.DetailRevision

  // clear card notes
  GetTestRevision(set.B.Revisions)
  assert.NoError(t, APITestMsg(ClearCardNotes, "DELETE", "/contact/cards/{cardID}/notes",
    &param, nil, APP_TOKENAGENT, set.B.Token, &detail, nil))
  assert.NotEqual(t, rev.Card, GetTestRevision(set.B.Revisions).Card)
  cards = &[]Card{}
  assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards?revision=" + cardRevision,
    nil, nil, APP_TOKENAGENT, set.B.Token, cards, &hdr))
  assert.Equal(t, 1, len(*cards))
  assert.NotEqual(t, detailRevision, (*cards)[0].Data.DetailRevision)

  // remove card from group
  card = &Card{}
  param["cardID"] = set.B.A.CardID
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.B.Token, card, nil))
  assert.Equal(t, "connected", card.Data.CardDetail.Status)
  viewRevision = card.Data.NotifiedView
  card = &Card{}
  param["cardID"] = set.A.B.CardID
  param["groupID"] = set.A.B.GroupID
  assert.NoError(t, APITestMsg(ClearCardGroup, "DELETE", "/contact/cards/{cardID}/groups/{groupID}",
    &param, nil, APP_TOKENAGENT, set.A.Token, card, nil))
  assert.Equal(t, 0, len(card.Data.CardDetail.Groups))
  assert.NotEqual(t, rev.Card, GetTestRevision(set.B.Revisions).Card)
  card = &Card{}
  param["cardID"] = set.B.A.CardID
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.B.Token, card, nil))
  assert.NotEqual(t, viewRevision, card.Data.NotifiedView)

  // disconnect card
  card = &Card{}
  param["cardID"] = set.A.B.CardID
  assert.NoError(t, APITestMsg(SetCardStatus, "PUT", "/contact/cards/{cardID}/status",
    &param, APP_CARDCONFIRMED, APP_TOKENAGENT, set.A.Token, card, nil))
  assert.NoError(t, APITestMsg(GetCloseMessage, "GET", "/contact/cards/{cardID}/closeMessage",
    &param, nil, APP_TOKENAGENT, set.A.Token, &msg, nil))
  assert.NoError(t, APITestMsg(SetCloseMessage, "GET", "/contact/closeMessage",
    nil, &msg, "", "", nil, nil))
  assert.NotNil(t,  GetTestRevision(set.B.Revisions))
  card = &Card{}
  param["cardID"] = set.B.A.CardID
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.B.Token, card, nil))
  assert.Equal(t, "confirmed", card.Data.CardDetail.Status)

  // cancel request
  card = &Card{}
  param["cardID"] = set.D.A.CardID
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.D.Token, card, nil))
  param["cardID"] = set.A.D.CardID
  assert.NoError(t, APITestMsg(SetCardStatus, "PUT", "/contact/cards/{cardID}/status",
    &param, APP_CARDCONFIRMED, APP_TOKENAGENT, set.A.Token, card, nil))
  assert.NoError(t, APITestMsg(GetCloseMessage, "GET", "/contact/cards/{cardID}/closeMessage",
    &param, nil, APP_TOKENAGENT, set.A.Token, &msg, nil))
  assert.NoError(t, APITestMsg(SetCloseMessage, "GET", "/contact/closeMessage",
    nil, &msg, "", "", nil, nil))

  // delete card
  param["cardID"] = set.A.C.CardID
  assert.NoError(t, APITestMsg(RemoveCard, "DELETE", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.A.Token, nil, nil))
  card = &Card{}
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.A.Token, card, nil))
  assert.Nil(t, card.Data)

  // update and delete group
  param["groupID"] = set.D.C.GroupID
  subject := &Subject{ DataType: "contactsynctype", Data: "contactsyncdata" }
  assert.NoError(t, APITestMsg(SetGroupSubject, "PUT", "/alias/groups/{groupID}",
    &param, subject, APP_TOKENAGENT, set.D.Token, nil, nil))
  groups = &[]Group{}
  assert.NoError(t, APITestMsg(GetGroups, "GET", "/alias/groups",
    nil, nil, APP_TOKENAGENT, set.D.Token, groups, nil))
  assert.Equal(t, 1, len(*groups))
  assert.Equal(t, "contactsynctype", (*groups)[0].Data.DataType)
  assert.Equal(t, "contactsyncdata", (*groups)[0].Data.Data)
  rev = GetTestRevision(set.C.Revisions)
  card = &Card{}
  param["cardID"] = set.C.D.CardID
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.C.Token, card, nil))
  viewRevision = card.Data.NotifiedView
  param["groupID"] = set.D.C.GroupID
  assert.NoError(t, APITestMsg(RemoveGroup, "GET", "/alias/groups/{groupID}",
    &param, nil, APP_TOKENAGENT, set.D.Token, nil, nil))
  groups = &[]Group{}
  assert.NoError(t, APITestMsg(GetGroups, "GET", "/alias/groups",
    nil, nil, APP_TOKENAGENT, set.D.Token, groups, nil))
  assert.Equal(t, 0, len(*groups))
  assert.NotEqual(t, rev.Card, GetTestRevision(set.C.Revisions).Card)
  card = &Card{}
  assert.NoError(t, APITestMsg(GetCard, "GET", "/contact/cards/{cardID}",
    &param, nil, APP_TOKENAGENT, set.C.Token, card, nil))
  assert.NotEqual(t, viewRevision, card.Data.NotifiedView)
}
