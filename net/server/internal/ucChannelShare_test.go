package databag

import (
	"github.com/stretchr/testify/assert"
	"strconv"
	"testing"
)

func TestChannelShare(t *testing.T) {
	var subject *Subject
	var channel *Channel
	var detail *ChannelDetail
	var channels *[]Channel
	var cards *[]Card
	aRevision := make(map[string][]string)
	bCardRevision := make(map[string][]string)
	bChannelRevision := make(map[string][]string)
	cCardRevision := make(map[string][]string)
	cChannelRevision := make(map[string][]string)
	var revision string
	params := make(map[string]string)
	var detailRevision int64
	var rev *Revision
	var aRev *Revision
	var cRev *Revision
	var bRev *Revision
	var r int64

	// setup testing group
	set, err := AddTestGroup("channelshare")
	assert.NoError(t, err)

	// add new channel
	channel = &Channel{}
	subject = &Subject{Data: "channeldata", DataType: "channeldatatype"}
	assert.NoError(t, APITestMsg(AddChannel, "POST", "/content/channels",
		nil, subject, APPTokenAgent, set.A.Token, channel, nil))

	// retrieve channels
	channels = &[]Channel{}
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels",
		nil, nil, APPTokenAgent, set.A.Token, channels, &aRevision))
	assert.Equal(t, 1, len(*channels))
	assert.NotNil(t, (*channels)[0].Data)
	detailRevision = (*channels)[0].Data.DetailRevision
	channels = &[]Channel{}
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels",
		nil, nil, APPTokenContact, set.B.A.Token, channels, &bChannelRevision))
	assert.Equal(t, 0, len(*channels))
	channels = &[]Channel{}
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels",
		nil, nil, APPTokenContact, set.C.A.Token, channels, &cChannelRevision))
	assert.Equal(t, 0, len(*channels))

	// assign channel to B
	params["channelID"] = channel.ID
	params["cardID"] = set.A.B.CardID
	assert.NoError(t, APITestMsg(SetChannelCard, "PUT", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))

	// check shared channel
	channels = &[]Channel{}
	revision = "?channelRevision=" + aRevision["Channel-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenAgent, set.A.Token, channels, &aRevision))
	assert.Equal(t, 1, len(*channels))
	assert.NotNil(t, (*channels)[0].Data)
	assert.NotEqual(t, detailRevision, (*channels)[0].Data.DetailRevision)
	channels = &[]Channel{}
	revision = "?channelRevision=" + bChannelRevision["Channel-Revision"][0] + "&viewRevision=" + bChannelRevision["View-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenContact, set.B.A.Token, channels, &bChannelRevision))
	assert.Equal(t, 1, len(*channels))
	assert.NotNil(t, (*channels)[0].Data)
	channels = &[]Channel{}
	revision = "?channelRevision=" + cChannelRevision["Channel-Revision"][0] + "&viewRevision=" + cChannelRevision["View-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenContact, set.C.A.Token, channels, &cChannelRevision))
	assert.Equal(t, 1, len(*channels))
	assert.Nil(t, (*channels)[0].Data)

	// get discovered channel
	detail = &ChannelDetail{}
	assert.NoError(t, APITestMsg(GetChannelDetail, "GET", "/content/channels/{channelID}/detail",
		&params, nil, APPTokenContact, set.B.A.Token, detail, nil))
	assert.Equal(t, "channeldatatype", detail.DataType)
	assert.Equal(t, 1, len(detail.Members))
	assert.Equal(t, set.B.GUID, detail.Members[0])
	assert.Nil(t, detail.Contacts)

	// get revision
	aRev = GetTestRevision(set.A.Revisions)
	bRev = GetTestRevision(set.B.Revisions)
	cRev = GetTestRevision(set.C.Revisions)
	cards = &[]Card{}
	assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards",
		nil, nil, APPTokenAgent, set.B.Token, cards, &bCardRevision))
	channels = &[]Channel{}
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels",
		nil, nil, APPTokenContact, set.B.A.Token, channels, &bChannelRevision))
	cards = &[]Card{}
	assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards",
		nil, nil, APPTokenAgent, set.C.Token, cards, &cCardRevision))
	channels = &[]Channel{}
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels",
		nil, nil, APPTokenContact, set.C.A.Token, channels, &cChannelRevision))

	// assign channel to C
	params["channelID"] = channel.ID
	params["cardID"] = set.A.C.CardID
	assert.NoError(t, APITestMsg(SetChannelCard, "PUT", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))

	// check revision change
	rev = GetTestRevision(set.A.Revisions)
	assert.NotEqual(t, rev.Channel, aRev.Channel)
	aRev = rev
	rev = GetTestRevision(set.B.Revisions)
	assert.NotEqual(t, rev.Card, bRev.Card)
	cards = &[]Card{}
	assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards?revision="+bCardRevision["Card-Revision"][0],
		nil, nil, APPTokenAgent, set.B.Token, cards, &bCardRevision))
	assert.Equal(t, 1, len(*cards))
	r, _ = strconv.ParseInt(bChannelRevision["Channel-Revision"][0], 10, 64)
	assert.NotEqual(t, r, (*cards)[0].Data.NotifiedChannel)
	r, _ = strconv.ParseInt(bChannelRevision["View-Revision"][0], 10, 64)
	assert.Equal(t, r, (*cards)[0].Data.NotifiedView)
	bRev = rev

	rev = GetTestRevision(set.C.Revisions)
	assert.NotEqual(t, rev.Card, cRev.Card)
	cards = &[]Card{}
	assert.NoError(t, APITestMsg(GetCards, "GET", "/contact/cards?revision="+cCardRevision["Card-Revision"][0],
		nil, nil, APPTokenAgent, set.C.Token, cards, &cCardRevision))
	assert.Equal(t, 1, len(*cards))
	r, _ = strconv.ParseInt(cChannelRevision["Channel-Revision"][0], 10, 64)
	assert.NotEqual(t, r, (*cards)[0].Data.NotifiedChannel)
	r, _ = strconv.ParseInt(cChannelRevision["View-Revision"][0], 10, 64)
	assert.Equal(t, r, (*cards)[0].Data.NotifiedView)
	cRev = rev

	channels = &[]Channel{}
	revision = "?channelRevision=" + bChannelRevision["Channel-Revision"][0] + "&viewRevision=" + bChannelRevision["View-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenContact, set.B.A.Token, channels, &bChannelRevision))
	assert.Equal(t, 1, len(*channels))
	channels = &[]Channel{}
	revision = "?channelRevision=" + cChannelRevision["Channel-Revision"][0] + "&viewRevision=" + cChannelRevision["View-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenContact, set.C.A.Token, channels, &cChannelRevision))
	assert.Equal(t, 1, len(*channels))

	// get discovered channel
	detail = &ChannelDetail{}
	assert.NoError(t, APITestMsg(GetChannelDetail, "GET", "/content/channels/{channelID}/detail",
		&params, nil, APPTokenContact, set.C.A.Token, detail, nil))
	assert.Equal(t, "channeldatatype", detail.DataType)
	assert.Equal(t, 2, len(detail.Members))
	assert.Nil(t, detail.Contacts)

	// reset notification
	GetTestRevision(set.B.Revisions)
	GetTestRevision(set.C.Revisions)

	// remove channel from C
	params["channelID"] = channel.ID
	params["cardID"] = set.A.C.CardID
	assert.NoError(t, APITestMsg(ClearChannelCard, "DELETE", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))

	// check channel view from C
	assert.NotNil(t, GetTestRevision(set.B.Revisions))
	assert.NotNil(t, GetTestRevision(set.C.Revisions))
	revision = "?channelRevision=" + cChannelRevision["Channel-Revision"][0] + "&viewRevision=" + cChannelRevision["View-Revision"][0]
	assert.NoError(t, APITestMsg(GetChannels, "GET", "/content/channels"+revision,
		nil, nil, APPTokenContact, set.C.A.Token, channels, &cChannelRevision))
	assert.Equal(t, 1, len(*channels))
	assert.Nil(t, (*channels)[0].Data)

	// update attribute
	image := "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"
	data := "{ \"nested\" : { \"image\" : \"" + image + "\" } }"
	subject = &Subject{Data: data, DataType: "nestedimage"}
	channel = &Channel{}
	assert.NoError(t, APITestMsg(SetChannelSubject, "PUT", "/content/channels/{channelID}/subject",
		&params, subject, APPTokenAgent, set.A.Token, channel, nil))

	// check notifications
	assert.NotNil(t, GetTestRevision(set.B.Revisions))
	assert.Nil(t, GetTestRevision(set.C.Revisions))

	// add C group to channel
	params["groupID"] = set.A.C.GroupID
	channel = &Channel{}
	assert.NoError(t, APITestMsg(SetChannelGroup, "PUT", "/content/channels/{channelID}/groups/{groupID}",
		&params, nil, APPTokenAgent, set.A.Token, channel, nil))
	assert.Equal(t, 1, len(channel.Data.ChannelDetail.Contacts.Cards))
	assert.Equal(t, 1, len(channel.Data.ChannelDetail.Contacts.Groups))

	// reset notification
	GetTestRevision(set.B.Revisions)
	GetTestRevision(set.C.Revisions)

	// remove channel from B
	params["channelID"] = channel.ID
	params["cardID"] = set.A.B.CardID
	assert.NoError(t, APITestMsg(ClearChannelCard, "DELETE", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, channel, nil))

	// check notifications
	assert.NotNil(t, GetTestRevision(set.B.Revisions))
	assert.NotNil(t, GetTestRevision(set.C.Revisions))

	// remove C group from channel
	params["groupID"] = set.A.C.GroupID
	channel = &Channel{}
	assert.NoError(t, APITestMsg(ClearChannelGroup, "DELETE", "/content/channels/{channelID}/groups/{groupID}",
		&params, nil, APPTokenAgent, set.A.Token, channel, nil))
	assert.Equal(t, 0, len(channel.Data.ChannelDetail.Contacts.Cards))
	assert.Equal(t, 0, len(channel.Data.ChannelDetail.Contacts.Groups))
}
