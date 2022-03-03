package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestMessangerApp(t *testing.T) {
  var params *TestApiParams
  var response *TestApiResponse

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
      Data: "channeldata",
      DataType: "channeldatatype",
    },
    tokenType: APP_TOKENAPP,
    token: set.A.Token,
  }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(AddChannel, params, response))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    for _, c := range testApp.channels {
      if c.channel.Data.ChannelDetail.Data == "channeldata" {
        return true
      }
    }
    return false
  }))


}

