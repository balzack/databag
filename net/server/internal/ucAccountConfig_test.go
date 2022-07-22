package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
  "encoding/json"
  "encoding/base64"
  "net/url"
)

func TestAccountConfig(t *testing.T) {
  var params *TestAPIParams
  var response *TestAPIResponse
  var channel *Channel
  var topic *Topic
  var assets *[]Asset
  var subject *Subject
  var pathParams *map[string]string

  // setup testing group
  set, err := AddTestGroup("accountconfig")
  assert.NoError(t, err)

  // allocate testing app
  app := NewTestApp()
  go app.Connect(set.A.Token)

  // asset to post
  image := "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"
  img, _ := base64.StdEncoding.DecodeString(image)

  // get reset token
  var token string
  params = &TestAPIParams{ query: "/account/auth", authorization: "accountconfigA:pass" }
  response = &TestAPIResponse{ data: &token }
  assert.NoError(t, TestAPIRequest(AddAccountAuthentication, params, response))

  // set reset token
  params = &TestAPIParams{ query: "/account/auth", tokenType: APPTokenReset, token: token, credentials: "newguy:ssap" }
  assert.NoError(t, TestAPIRequest(SetAccountAuthentication, params, nil))

  // fail getting reset token
  params = &TestAPIParams{ query: "/account/auth", authorization: "accountconfigA:pass" }
  response = &TestAPIResponse{ data: &token }
  assert.Error(t, TestAPIRequest(AddAccountAuthentication, params, response))

  // create new channel
  channel = &Channel{}
  subject = &Subject{ Data: "channeldata", DataType: "channeldatatype" }
  params = &TestAPIParams{ query: "/content/channels", tokenType: APPTokenAgent, token: set.A.Token, body: subject }
  response = &TestAPIResponse{ data: channel }
  assert.NoError(t, TestAPIRequest(AddChannel, params, response))

  // create new topic
  topic = &Topic{}
  subject = &Subject{ DataType: "topicdatatype", Data: "topicdata" }
  params = &TestAPIParams{ query: "/content/channels/{channelID}/topics", tokenType: APPTokenAgent, token: set.A.Token,
    path: map[string]string{ "channelID": channel.ID }, body: subject }
  response = &TestAPIResponse{ data: topic }
  assert.NoError(t, TestAPIRequest(AddChannelTopic, params, response))

  // add asset to topic
  assets = &[]Asset{}
  pathParams = &map[string]string{ "channelID": channel.ID, "topicID": topic.ID }
  transforms, err := json.Marshal([]string{ "copy;photo", "copy;photo", })
  assert.NoError(t, err)
  assert.NoError(t, APITestUpload(AddChannelTopicAsset, "POST",
    "/content/channels/{channelID}/topics/{topicID}/assets?transforms=" + url.QueryEscape(string(transforms)),
    pathParams, img, APPTokenAgent, set.A.Token, assets, nil))

  // update topic
  status := APPTopicConfirmed
  params = &TestAPIParams{ query: "/content/channels/{channelID}/topics/{topicID}", tokenType: APPTokenAgent, token: set.A.Token,
    path: map[string]string{ "channelID": channel.ID, "topicID": topic.ID }, body: &status }
  assert.NoError(t, TestAPIRequest(SetChannelTopicConfirmed, params, nil))

  // wait for assets
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    for _, testChannel := range testApp.channels {
      if testChannel.channel.ID == channel.ID {
        for _, testTopic := range testChannel.topics {
          if testTopic.topic.ID == topic.ID {
            detail := testTopic.topic.Data.TopicDetail
            if detail.Status == APPTopicConfirmed && detail.Transform == APPTransformComplete {
              return true
            }
          }
        }
      }
    }

    return false
  }))

  // set to searchable
  searchable := true
  params = &TestAPIParams{ query: "/account/searchable", tokenType: APPTokenAgent, token: set.A.Token, body: &searchable }
  assert.NoError(t, TestAPIRequest(SetAccountSearchable, params, nil))

  // get account status
  accountStatus := &AccountStatus{}
  params = &TestAPIParams{ query: "/account/status", tokenType: APPTokenAgent, token: set.A.Token }
  response = &TestAPIResponse{ data: accountStatus }
  assert.NoError(t, TestAPIRequest(GetAccountStatus, params, response))
  assert.True(t, accountStatus.Searchable)

  // add asset to topic
  assets = &[]Asset{}
  pathParams = &map[string]string{ "channelID": channel.ID, "topicID": topic.ID }
  assert.Error(t, APITestUpload(AddChannelTopicAsset, "POST",
    "/content/channels/{channelID}/topics/{topicID}/assets?transforms=" + url.QueryEscape(string(transforms)),
    pathParams, img, APPTokenAgent, set.A.Token, assets, nil))

  // get list of accounts
  profiles := []CardProfile{}
  params = &TestAPIParams{ query: "/account/listing" }
  response = &TestAPIResponse{ data: &profiles }
  assert.NoError(t, TestAPIRequest(GetAccountListing, params, response))
  assert.Equal(t, 1, len(profiles))
  assert.Equal(t, set.A.GUID, profiles[0].GUID);

PrintMsg(set.A.GUID)

  // delete account
  params = &TestAPIParams{ query: "/account/profile", authorization: "newguy:ssap" }
  assert.NoError(t, TestAPIRequest(RemoveAccount, params, nil))

}
