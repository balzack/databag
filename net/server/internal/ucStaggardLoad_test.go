package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

func TestStaggardLoad(t *testing.T) {
  var params *TestApiParams
  var response *TestApiResponse
  var channel *Channel
  var topic *Topic
  var topics *[]Topic

  // allocate test accounts
  set, err := AddTestGroup("staggardload")
  assert.NoError(t, err)

  // allocate new test app
  app := NewTestApp()
  go app.Connect(set.A.Token)

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Handle == "staggardloadA" {
      return true
    }
    return false
  }))

  // add a channel
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels",
    body: &Subject{
      Data: "channeldataA",
      DataType: "channeldatatypeA",
    },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  channel = &Channel{}
  response = &TestApiResponse{ data: channel }
  assert.NoError(t, TestApiRequest(AddChannel, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.Id == channel.Id {
        return true
      }
    }
    return false
  }))

  // add a topic to channel
  ids := []string{}
  for i := 0; i < 128; i++ {
    params = &TestApiParams{
      restType: "POST",
      query: "/content/channels/{channelId}/topics",
      path: map[string]string{ "channelId": channel.Id },
      body: &Subject{
        Data: strconv.Itoa(i),
        DataType: "channeltopicdatatypeA",
      },
      tokenType: APP_TOKENAGENT,
      token: set.A.Token,
    }
    topic = &Topic{}
    response = &TestApiResponse{ data: topic }
    assert.NoError(t, TestApiRequest(AddChannelTopic, params, response))
    ids = append(ids, topic.Id);
  }

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.Id == channel.Id {
        if  len(c.topics) == 128 {
          return true
        }
      }
    }
    return false
  }))

  params = &TestApiParams {
    restType: "GET",
    query: "/content/channels/{channelId}/topics",
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topics = &[]Topic{}
  response = &TestApiResponse{ data: topics }
  assert.NoError(t, TestApiRequest(GetChannelTopics, params, response));
  assert.Equal(t, len(*topics), 128);

  params = &TestApiParams {
    restType: "GET",
    query: "/content/channels/{channelId}/topics?count=13",
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topics = &[]Topic{}
  response = &TestApiResponse{ data: topics }
  assert.NoError(t, TestApiRequest(GetChannelTopics, params, response));
  assert.Equal(t, len(*topics), 13);

  //marker, _ := strconv.Atoi(response.header["Topic-Marker"][0])
  //revision, _ := strconv.Atoi(response.header["Topic-Revision"][0])

  params = &TestApiParams {
    restType: "GET",
    query: "/content/channels/{channelId}/topics?count=13&end=" + response.header["Topic-Marker"][0],
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topics = &[]Topic{}
  response = &TestApiResponse{ data: topics }
  assert.NoError(t, TestApiRequest(GetChannelTopics, params, response));
  assert.Equal(t, len(*topics), 13);

  marker := response.header["Topic-Marker"][0]
  revision := response.header["Topic-Revision"][0]

  params = &TestApiParams {
    restType: "DELETE",
    query: "/content/channels/{channelId}/topics/{topicId}",
    path: map[string]string{ "channelId": channel.Id, "topicId": ids[13] },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  response = &TestApiResponse{ }
  assert.NoError(t, TestApiRequest(RemoveChannelTopic, params, response));

  params = &TestApiParams {
    restType: "GET",
    query: "/content/channels/{channelId}/topics?begin=" + marker + "&revision=" + revision,
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topics = &[]Topic{}
  response = &TestApiResponse{ data: topics }
  assert.NoError(t, TestApiRequest(GetChannelTopics, params, response));
  assert.Equal(t, 0, len(*topics));

  params = &TestApiParams {
    restType: "DELETE",
    query: "/content/channels/{channelId}/topics/{topicId}",
    path: map[string]string{ "channelId": channel.Id, "topicId": ids[108] },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  response = &TestApiResponse{ }
  assert.NoError(t, TestApiRequest(RemoveChannelTopic, params, response));

  params = &TestApiParams {
    restType: "GET",
    query: "/content/channels/{channelId}/topics?begin=" + marker + "&revision=" + revision,
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topics = &[]Topic{}
  response = &TestApiResponse{ data: topics }
  assert.NoError(t, TestApiRequest(GetChannelTopics, params, response));
  assert.Equal(t, 0, len(*topics));
}

