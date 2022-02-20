package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestContactApp(t *testing.T) {

  // allocate test accounts
  set, err := AddTestGroup("contactapp")
  assert.NoError(t, err)

  // allocate new test app
  app := NewTestApp()
  go app.Connect(set.A.Token)

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Handle == "contactappA" {
      return true
    }
    return false
  }))

  // update profile name
  profileData := &ProfileData{
    Name: "Roland",
    Location: "San Diago",
  };
  assert.NoError(t, ApiTestMsg(SetProfile, "PUT", "/profile/data", nil, profileData,
      APP_TOKENAPP, set.A.Token, nil, nil))

  // wait for test
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool{
    if testApp.profile.Location == "San Diago" {
      return true
    }
    return false
  }))


}
