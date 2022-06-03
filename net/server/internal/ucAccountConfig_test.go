package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
  "encoding/json"
  "encoding/base64"
  "net/url"
)

func TestAccountConfig(t *testing.T) {
  var params *TestApiParams
  var response *TestApiResponse
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
  params = &TestApiParams{ query: "/account/auth", authorization: "accountconfigA:pass" }
  response = &TestApiResponse{ data: &token }
  assert.NoError(t, TestApiRequest(AddAccountAuthentication, params, response))

  // set reset token
  params = &TestApiParams{ query: "/account/auth", tokenType: APP_TOKENRESET, token: token, credentials: "newguy:ssap" }
  assert.NoError(t, TestApiRequest(SetAccountAuthentication, params, nil))

  // fail getting reset token
  params = &TestApiParams{ query: "/account/auth", authorization: "accountconfigA:pass" }
  response = &TestApiResponse{ data: &token }
  assert.Error(t, TestApiRequest(AddAccountAuthentication, params, response))

  // create new channel
  channel = &Channel{}
  subject = &Subject{ Data: "channeldata", DataType: "channeldatatype" }
  params = &TestApiParams{ query: "/content/channels", tokenType: APP_TOKENAGENT, token: set.A.Token, body: subject }
  response = &TestApiResponse{ data: channel }
  assert.NoError(t, TestApiRequest(AddChannel, params, response))

  // create new topic
  topic = &Topic{}
  subject = &Subject{ DataType: "topicdatatype", Data: "topicdata" }
  params = &TestApiParams{ query: "/content/channels/{channelId}/topics", tokenType: APP_TOKENAGENT, token: set.A.Token,
    path: map[string]string{ "channelId": channel.Id }, body: subject }
  response = &TestApiResponse{ data: topic }
  assert.NoError(t, TestApiRequest(AddChannelTopic, params, response))

  // add asset to topic
  assets = &[]Asset{}
  pathParams = &map[string]string{ "channelId": channel.Id, "topicId": topic.Id }
  transforms, err := json.Marshal([]string{ "copy;photo", "copy;photo", })
  assert.NoError(t, err)
  assert.NoError(t, ApiTestUpload(AddChannelTopicAsset, "POST",
    "/content/channels/{channelId}/topics/{topicId}/assets?transforms=" + url.QueryEscape(string(transforms)),
    pathParams, img, APP_TOKENAGENT, set.A.Token, assets, nil))

  // update topic
  status := APP_TOPICCONFIRMED
  params = &TestApiParams{ query: "/content/channels/{channelId}/topics/{topicId}", tokenType: APP_TOKENAGENT, token: set.A.Token,
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id }, body: &status }
  assert.NoError(t, TestApiRequest(SetChannelTopicConfirmed, params, nil))

  // wait for assets
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    for _, testChannel := range testApp.channels {
      if testChannel.channel.Id == channel.Id {
        for _, testTopic := range testChannel.topics {
          if testTopic.topic.Id == topic.Id {
            detail := testTopic.topic.Data.TopicDetail
            if detail.Status == APP_TOPICCONFIRMED && detail.Transform == APP_TRANSFORMCOMPLETE {
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
  params = &TestApiParams{ query: "/account/searchable", tokenType: APP_TOKENAGENT, token: set.A.Token, body: &searchable }
  assert.NoError(t, TestApiRequest(SetAccountSearchable, params, nil))

  // get account status
  accountStatus := &AccountStatus{}
  params = &TestApiParams{ query: "/account/status", tokenType: APP_TOKENAGENT, token: set.A.Token }
  response = &TestApiResponse{ data: accountStatus }
  assert.NoError(t, TestApiRequest(GetAccountStatus, params, response))
  assert.True(t, accountStatus.Searchable)

  // add asset to topic
PrintMsg("ADD TOPIC TEST");
  assets = &[]Asset{}
  pathParams = &map[string]string{ "channelId": channel.Id, "topicId": topic.Id }
  assert.Error(t, ApiTestUpload(AddChannelTopicAsset, "POST",
    "/content/channels/{channelId}/topics/{topicId}/assets?transforms=" + url.QueryEscape(string(transforms)),
    pathParams, img, APP_TOKENAGENT, set.A.Token, assets, nil))

  // get list of accounts
  profiles := []CardProfile{}
  params = &TestApiParams{ query: "/account/listing" }
  response = &TestApiResponse{ data: &profiles }
  assert.NoError(t, TestApiRequest(GetAccountListing, params, response))
  assert.Equal(t, 1, len(profiles))
  assert.Equal(t, set.A.Guid, profiles[0].Guid);

PrintMsg(set.A.Guid)

  // delete account
  params = &TestApiParams{ query: "/account/profile", authorization: "newguy:ssap" }
  assert.NoError(t, TestApiRequest(RemoveAccount, params, nil))

}
