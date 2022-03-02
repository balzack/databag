package databag

import (
  "bytes"
  "testing"
  "encoding/base64"
  "github.com/stretchr/testify/assert"
  "encoding/json"
  "net/url"
)

func TestTopicShare(t *testing.T) {
  var topic *Topic
  var channel *Channel
  var subject *Subject
  params := make(map[string]string)
  header := make(map[string][]string)
  var err error
  var data []byte

  // setup testing group
  set, err := AddTestGroup("topicshare")
  assert.NoError(t, err)

  // add new channel
  channel = &Channel{}
  subject = &Subject{ Data: "channeldata", DataType: "channeldatatype" }
  assert.NoError(t, ApiTestMsg(AddChannel, "POST", "/content/channels",
    nil, subject, APP_TOKENAPP, set.A.Token, channel, nil))
  image := "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"
  img, _ := base64.StdEncoding.DecodeString(image)
  subject = &Subject{ Data: "{ \"nested\" : { \"image\" : \"" + image + "\" } }", DataType: "nestedimage" }
  params["channelId"] = channel.Id
  assert.NoError(t, ApiTestMsg(SetChannelSubject, "PUT", "/content/channels/{channelId}/subject",
    &params, subject, APP_TOKENAPP, set.A.Token, channel, nil))
  params["cardId"] = set.A.B.CardId
  assert.NoError(t, ApiTestMsg(SetChannelCard, "PUT", "/content/channels/{channelId}/cards/{cardId}",
    &params, nil, APP_TOKENAPP, set.A.Token, nil, nil))
  params["cardId"] = set.A.C.CardId
  assert.NoError(t, ApiTestMsg(SetChannelCard, "PUT", "/content/channels/{channelId}/cards/{cardId}",
    &params, nil, APP_TOKENAPP, set.A.Token, nil, nil))

  // view channel
  channel = &Channel{}
  assert.NoError(t, ApiTestMsg(GetChannel, "GET", "/content/channels/{channelId}",
    &params, nil, APP_TOKENAPP, set.A.Token, channel, nil))
  assert.NotNil(t, channel.Data.ChannelDetail);
  channel = &Channel{}
  assert.NoError(t, ApiTestMsg(GetChannel, "GET", "/content/channels/{channelId}",
    &params, nil, APP_TOKENCONTACT, set.B.A.Token, channel, nil))
  assert.NotNil(t, channel.Data.ChannelDetail);
  channel = &Channel{}
  assert.NoError(t, ApiTestMsg(GetChannel, "GET", "/content/channels/{channelId}",
    &params, nil, APP_TOKENCONTACT, set.B.A.Token, channel, nil))
  assert.NotNil(t, channel.Data.ChannelDetail);
  params["field"] = "nested.image"
  data, header, err = ApiTestData(GetChannelSubjectField, "GET", "/content/channels/{channelId}/subject/{field}",
    &params, nil, APP_TOKENAPP, set.A.Token, 0, 0)
  assert.NoError(t, err)
  assert.Equal(t, "image/png", header["Content-Type"][0])
  assert.Zero(t, bytes.Compare(img, data))
  data, header, err = ApiTestData(GetChannelSubjectField, "GET", "/content/channels/{channelId}/subject/{field}",
    &params, nil, APP_TOKENCONTACT, set.B.A.Token, 0, 0)
  assert.NoError(t, err)
  assert.Equal(t, "image/png", header["Content-Type"][0])
  assert.Zero(t, bytes.Compare(img, data))
  data, header, err = ApiTestData(GetChannelSubjectField, "GET", "/content/channels/{channelId}/subject/{field}",
    &params, nil, APP_TOKENCONTACT, set.C.A.Token, 0, 0)
  assert.NoError(t, err)
  assert.Equal(t, "image/png", header["Content-Type"][0])
  assert.Zero(t, bytes.Compare(img, data))


  // add a topc
  topic = &Topic{}
  subject = &Subject{ DataType: "topicdatatype", Data: "subjectfromA" }
  assert.NoError(t, ApiTestMsg(AddChannelTopic, "POST", "/content/channels/{channelId}/topics",
    &params, subject, APP_TOKENAPP, set.A.Token, topic, nil))
  topic = &Topic{}
  subject = &Subject{ DataType: "topicdatatype", Data: "subjectfromB" }
  assert.NoError(t, ApiTestMsg(AddChannelTopic, "POST", "/content/channels/{channelId}/topics",
    &params, subject, APP_TOKENCONTACT, set.B.A.Token, topic, nil))
  params["topicId"] = topic.Id
  assert.NoError(t, ApiTestMsg(SetChannelTopicConfirmed, "PUT", "/content/channels/{channelId}/topics/{topicId}/confirmed",
    &params, APP_TOPICCONFIRMED, APP_TOKENCONTACT, set.B.A.Token, nil, nil))
  topic = &Topic{}
  subject = &Subject{ DataType: "topicdatatype", Data: "subjectfromC" }
  assert.NoError(t, ApiTestMsg(AddChannelTopic, "POST", "/content/channels/{channelId}/topics",
    &params, subject, APP_TOKENCONTACT, set.C.A.Token, topic, nil))

  // add asset to topic
  assets := []Asset{}
  params["topicId"] = topic.Id
  transforms, err := json.Marshal([]string{ "copy;photo" })
  assert.NoError(t, err)
  assert.NoError(t, ApiTestUpload(AddChannelTopicAsset, "POST", "/content/channels/{channelId}/topics/{topicId}/assets?transforms=" + url.QueryEscape(string(transforms)),
    &params, img, APP_TOKENCONTACT, set.C.A.Token, &assets, nil))

  // view topics
  topics := &[]Topic{}
  assert.NoError(t, ApiTestMsg(GetChannelTopics, "GET", "/content/channels/{channelId}/topics",
    &params, nil, APP_TOKENAPP, set.A.Token, topics, nil))

  // add a tag to topic
  tag := Tag{}
  subject = &Subject{ DataType: "tagdatatype", Data: "subjectfromA" }
  assert.NoError(t, ApiTestMsg(AddChannelTopicTag, "POST", "/content/channels/{channelId}/topcis/{topicId}",
    &params, subject, APP_TOKENAPP, set.A.Token, tag, nil))

  // get list of assets
  assets = []Asset{}
  assert.NoError(t, ApiTestMsg(GetChannelTopicAssets, "GET", "/content/channels/{channelId}/topics/{topicId}",
    &params, nil, APP_TOKENCONTACT, set.C.A.Token, &assets, nil))
  assert.Equal(t, 2, len(assets))

  // delete each asset
  for _, asset := range assets {
    params["assetId"] = asset.AssetId
    assert.NoError(t, ApiTestMsg(RemoveChannelTopicAsset, "DELETE", "/content/channels/{channelId}/topics/{topicId}/assets/{assetId}",
      &params, nil, APP_TOKENCONTACT, set.C.A.Token, nil, nil))
  }

  // get list of assets
  assets = []Asset{}
  assert.NoError(t, ApiTestMsg(GetChannelTopicAssets, "GET", "/content/channels/{channelId}/topics/{topicId}",
    &params, nil, APP_TOKENCONTACT, set.C.A.Token, &assets, nil))
  assert.Equal(t, 0, len(assets))
}

