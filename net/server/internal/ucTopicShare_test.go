package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestTopicShare(t *testing.T) {
  var subject *Subject
  var channel *Channel
  var channels *[]Channel
  aRevision := make(map[string][]string)
  bRevision := make(map[string][]string)
  cRevision := make(map[string][]string)
  var revision string
  params := make(map[string]string)
  var detailRevision int64

  // setup testing group
  set, err := AddTestGroup("topicshare")
  assert.NoError(t, err)

  // add new channel
  channel = &Channel{}
  subject = &Subject{ Data: "channeldata", DataType: "channeldatatype" }
  assert.NoError(t, ApiTestMsg(AddChannel, "POST", "/content/channels",
    nil, subject, APP_TOKENAPP, set.A.Token, channel, nil))

  // retrieve channels
  channels = &[]Channel{}
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels",
    nil, nil, APP_TOKENAPP, set.A.Token, channels, &aRevision))
  assert.Equal(t, 1, len(*channels))
  assert.NotNil(t, (*channels)[0].Data)
  detailRevision = (*channels)[0].Data.DetailRevision
  channels = &[]Channel{}
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels",
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, channels, &bRevision))
  assert.Equal(t, 0, len(*channels))
  channels = &[]Channel{}
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels",
    nil, nil, APP_TOKENCONTACT, set.C.A.Token, channels, &cRevision))
  assert.Equal(t, 0, len(*channels))

  // assign channel to B
  params["channelId"] = channel.Id
  params["cardId"] = set.A.B.CardId
  assert.NoError(t, ApiTestMsg(SetChannelCard, "PUT", "/content/channels/{channelId}/cards/{cardId}",
    &params, nil, APP_TOKENAPP, set.A.Token, nil, nil))

  // check shared channel
  channels = &[]Channel{}
  revision = "?channelRevision=" + aRevision["Channel-Revision"][0]
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels" + revision,
    nil, nil, APP_TOKENAPP, set.A.Token, channels, &aRevision))
  assert.Equal(t, 1, len(*channels))
  assert.NotNil(t, (*channels)[0].Data)
  assert.NotEqual(t, detailRevision, (*channels)[0].Data.DetailRevision)
  channels = &[]Channel{}
  revision = "?channelRevision=" + bRevision["Channel-Revision"][0] + "&viewRevision=" + bRevision["View-Revision"][0]
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels" + revision,
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, channels, &bRevision))
  assert.Equal(t, 1, len(*channels))
  assert.NotNil(t, (*channels)[0].Data)
  channels = &[]Channel{}
  revision = "?channelRevision=" + cRevision["Channel-Revision"][0] + "&viewRevision=" + cRevision["View-Revision"][0]
  assert.NoError(t, ApiTestMsg(GetChannels, "GET", "/content/channels" + revision,
    nil, nil, APP_TOKENCONTACT, set.C.A.Token, channels, &cRevision))
  assert.Equal(t, 1, len(*channels))
  assert.Nil(t, (*channels)[0].Data)

  // get discovered channel
  channel = &Channel{}
  assert.NoError(t, ApiTestMsg(GetChannel, "GET", "/content/channels/{channelId}",
    &params, nil, APP_TOKENCONTACT, set.B.A.Token, channel, nil))
  assert.Equal(t, "channeldatatype", channel.Data.ChannelDetail.DataType)
  assert.Equal(t, 1, len(channel.Data.ChannelDetail.Members))
  assert.Equal(t, set.B.Guid, channel.Data.ChannelDetail.Members[0])
}


