package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestMessangerApp(t *testing.T) {
  var params *TestApiParams
  var response *TestApiResponse
  var channel *Channel
  var topic *Topic
  var tag *Tag

  // allocate test accounts
  set, err := AddTestGroup("messangerapp")
  assert.NoError(t, err)

  // allocate new test app
  app := NewTestApp()
  go app.Connect(set.A.Token)

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Handle == "messangerappA" {
      return true
    }
    return false
  }))

  // set profile 
  params = &TestApiParams{
    restType: "PUT",
    query: "/profile/data",
    body: &ProfileData{
      Name: "Roland",
      Location: "The City",
    },
    tokenType: APP_TOKENAPP,
    token: set.A.Token,
  }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(SetProfile, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Location == "The City" {
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
    tokenType: APP_TOKENAPP,
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
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels/{channelId}/topics",
    path: map[string]string{ "channelId": channel.Id },
    body: &Subject{
      Data: "channeltopicdataA",
      DataType: "channeltopicdatatypeA",
    },
    tokenType: APP_TOKENAPP,
    token: set.A.Token,
  }
  topic = &Topic{}
  response = &TestApiResponse{ data: topic }
  assert.NoError(t, TestApiRequest(AddChannelTopic, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.Id == channel.Id {
        for _, t := range c.topics {
          if t.topic.Id == topic.Id {
            return true
          }
        }
      }
    }
    return false
  }))

  // add a tag to channel topic
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels/{channelId}/topics/{topicId}/tags",
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    body: &Subject{
      Data: "channeltopictagdataA",
      DataType: "channeltopictagdatatypeA",
    },
    tokenType: APP_TOKENAPP,
    token: set.A.Token,
  }
  tag = &Tag{}
  response = &TestApiResponse{ data: tag }
  assert.NoError(t, TestApiRequest(AddChannelTopicTag, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testChannel := range testApp.channels {
      if testChannel.channel.Id == channel.Id {
        for _, testTopic := range testChannel.topics {
          if testTopic.topic.Id == topic.Id {
            for _, testTag := range testTopic.tags {
              if testTag.Id == tag.Id {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }))


  // add a channel
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels",
    body: &Subject{
      Data: "channeldataB",
      DataType: "channeldatatypeB",
    },
    tokenType: APP_TOKENAPP,
    token: set.B.Token,
  }
  channel = &Channel{}
  response = &TestApiResponse{ data: channel }
  assert.NoError(t, TestApiRequest(AddChannel, params, response))

  // share channel with A
  params = &TestApiParams{
    restType: "PUT",
    query: "/content/channels/{channelId}/cards/{cardId}",
    path: map[string]string{ "cardId": set.B.A.CardId, "channelId": channel.Id },
    tokenType: APP_TOKENAPP,
    token: set.B.Token,
  }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(SetChannelCard, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.Id == set.A.B.CardId {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.Id == channel.Id {
            return true
          }
        }
      }
    }
    return false
  }))

  // add a topic to channel
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels/{channelId}/topics",
    path: map[string]string{ "channelId": channel.Id },
    body: &Subject{
      Data: "channeltopicdataB",
      DataType: "channeltopicdatatypeB",
    },
    tokenType: APP_TOKENCONTACT,
    token: set.A.B.Token,
  }
  topic = &Topic{}
  response = &TestApiResponse{ data: topic }
  assert.NoError(t, TestApiRequest(AddChannelTopic, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.Id == set.A.B.CardId {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.Id == channel.Id {
            for _, t := range testChannel.topics {
              if t.topic.Id == topic.Id {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }))

  // add a tag to channel topic
  params = &TestApiParams{
    restType: "POST",
    query: "/content/channels/{channelId}/topics/{topicId}/tags",
    path: map[string]string{ "channelId": channel.Id, "topicId": topic.Id },
    body: &Subject{
      Data: "channeltopictagdataB",
      DataType: "channeltopictagdatatypeB",
    },
    tokenType: APP_TOKENAPP,
    token: set.B.Token,
  }
  tag = &Tag{}
  response = &TestApiResponse{ data: tag }
  assert.NoError(t, TestApiRequest(AddChannelTopicTag, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.Id == set.A.B.CardId {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.Id == channel.Id {
            for _, testTopic := range testChannel.topics {
              if testTopic.topic.Id == topic.Id {
                for _, testTag := range testTopic.tags {
                  if testTag.Id == tag.Id {
                    return true
                  }
                }
              }
            }
          }
        }
      }
    }
    return false
  }))

}

