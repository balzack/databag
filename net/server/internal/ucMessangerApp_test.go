package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestMessangerApp(t *testing.T) {
  var params *TestAPIParams
  var response *TestAPIResponse
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
  params = &TestAPIParams{
    restType: "PUT",
    query: "/profile/data",
    body: &ProfileData{
      Name: "Roland",
      Location: "The City",
    },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(SetProfile, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Location == "The City" {
      return true
    }
    return false
  }))

  // add a channel
  params = &TestAPIParams{
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
  response = &TestAPIResponse{ data: channel }
  assert.NoError(t, TestAPIRequest(AddChannel, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.ID == channel.ID {
        return true
      }
    }
    return false
  }))

  // add a topic to channel
  params = &TestAPIParams{
    restType: "POST",
    query: "/content/channels/{channelID}/topics",
    path: map[string]string{ "channelID": channel.ID },
    body: &Subject{
      Data: "channeltopicdataA",
      DataType: "channeltopicdatatypeA",
    },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  topic = &Topic{}
  response = &TestAPIResponse{ data: topic }
  assert.NoError(t, TestAPIRequest(AddChannelTopic, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.ID == channel.ID {
        for _, t := range c.topics {
          if t.topic.ID == topic.ID {
            return true
          }
        }
      }
    }
    return false
  }))

  // add a tag to channel topic
  params = &TestAPIParams{
    restType: "POST",
    query: "/content/channels/{channelID}/topics/{topicID}/tags",
    path: map[string]string{ "channelID": channel.ID, "topicID": topic.ID },
    body: &Subject{
      Data: "channeltopictagdataA",
      DataType: "channeltopictagdatatypeA",
    },
    tokenType: APP_TOKENAGENT,
    token: set.A.Token,
  }
  tag = &Tag{}
  response = &TestAPIResponse{ data: tag }
  assert.NoError(t, TestAPIRequest(AddChannelTopicTag, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testChannel := range testApp.channels {
      if testChannel.channel.ID == channel.ID {
        for _, testTopic := range testChannel.topics {
          if testTopic.topic.ID == topic.ID {
            for _, testTag := range testTopic.tags {
              if testTag.ID == tag.ID {
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
  params = &TestAPIParams{
    restType: "POST",
    query: "/content/channels",
    body: &Subject{
      Data: "channeldataB",
      DataType: "channeldatatypeB",
    },
    tokenType: APP_TOKENAGENT,
    token: set.B.Token,
  }
  channel = &Channel{}
  response = &TestAPIResponse{ data: channel }
  assert.NoError(t, TestAPIRequest(AddChannel, params, response))

  // share channel with A
  params = &TestAPIParams{
    restType: "PUT",
    query: "/content/channels/{channelID}/cards/{cardID}",
    path: map[string]string{ "cardID": set.B.A.CardID, "channelID": channel.ID },
    tokenType: APP_TOKENAGENT,
    token: set.B.Token,
  }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(SetChannelCard, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.ID == set.A.B.CardID {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.ID == channel.ID {
            return true
          }
        }
      }
    }
    return false
  }))

  // add a topic to channel
  params = &TestAPIParams{
    restType: "POST",
    query: "/content/channels/{channelID}/topics",
    path: map[string]string{ "channelID": channel.ID },
    body: &Subject{
      Data: "channeltopicdataB",
      DataType: "channeltopicdatatypeB",
    },
    tokenType: APP_TOKENCONTACT,
    token: set.A.B.Token,
  }
  topic = &Topic{}
  response = &TestAPIResponse{ data: topic }
  assert.NoError(t, TestAPIRequest(AddChannelTopic, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.ID == set.A.B.CardID {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.ID == channel.ID {
            for _, t := range testChannel.topics {
              if t.topic.ID == topic.ID {
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
  params = &TestAPIParams{
    restType: "POST",
    query: "/content/channels/{channelID}/topics/{topicID}/tags",
    path: map[string]string{ "channelID": channel.ID, "topicID": topic.ID },
    body: &Subject{
      Data: "channeltopictagdataB",
      DataType: "channeltopictagdatatypeB",
    },
    tokenType: APP_TOKENAGENT,
    token: set.B.Token,
  }
  tag = &Tag{}
  response = &TestAPIResponse{ data: tag }
  assert.NoError(t, TestAPIRequest(AddChannelTopicTag, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, testContact := range testApp.contacts {
      if testContact.card.ID == set.A.B.CardID {
        for _, testChannel := range testContact.channels {
          if testChannel.channel.ID == channel.ID {
            for _, testTopic := range testChannel.topics {
              if testTopic.topic.ID == topic.ID {
                for _, testTag := range testTopic.tags {
                  if testTag.ID == tag.ID {
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

  // unshare channel with A
  params = &TestAPIParams{
    restType: "DELETE",
    query: "/content/channels/{channelID}/cards/{cardID}",
    path: map[string]string{ "cardID": set.B.A.CardID, "channelID": channel.ID },
    tokenType: APP_TOKENAGENT,
    token: set.B.Token,
  }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(ClearChannelCard, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet {
      _, channelSet := contact.channels[channel.ID]
      if !channelSet {
        return true
      }
    }
    return false
  }))
}

