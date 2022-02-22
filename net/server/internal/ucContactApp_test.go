package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestContactApp(t *testing.T) {
  var params *TestApiParams
  var response *TestApiResponse

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

  // add a new article
  article := &Article{}
  subject := &Subject{ Data: "subjectdata", DataType: "subjectdatatype" }
  params = &TestApiParams{ restType: "POST", query: "/articles", tokenType: APP_TOKENAPP, token: set.A.Token, body: subject }
  response = &TestApiResponse{ data: article }
  assert.NoError(t, TestApiRequest(AddArticle, params, response))

  // wait for a
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    a, set := testApp.articles[article.Id]
    if set && a.Data.Data == "subjectdata" {
      return true
    }
    return false
  }))

  // remove a new article
  params = &TestApiParams{ restType: "DELETE", query: "/articles/{articleId}", path: map[string]string{ "articleId": article.Id },
    tokenType: APP_TOKENAPP, token: set.A.Token, body: subject }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(RemoveArticle, params, response))

  // wait for a to be removed
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    if _, set := testApp.articles[article.Id]; !set {
      return true
    }
    return false
  }))

}
