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

  // add a new article in contact
  article = &Article{}
  subject = &Subject{ Data: "subjectdataB", DataType: "subjectdatatypeB" }
  params = &TestApiParams{ restType: "POST", query: "/articles", tokenType: APP_TOKENAPP, token: set.B.Token, body: subject }
  response = &TestApiResponse{ data: article }
  assert.NoError(t, TestApiRequest(AddArticle, params, response))
  articleId := article.Id

  // share article
  article = &Article{}
  params = &TestApiParams{ restType: "POST", query: "/articles/{articleId}/groups/{groupId}", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "articleId": articleId, "groupId": set.B.A.GroupId }}
  response = &TestApiResponse{ data: article }
  assert.NoError(t, TestApiRequest(SetArticleGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardId]
    if contactSet {
      _, articleSet := contact.articles[articleId]
      if articleSet {
        return true
      }
    }
    return false
  }))

  // remove new article in contact
  article = &Article{}
  params = &TestApiParams{ restType: "DELETE", query: "/articles/{articleId}", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "articleId": articleId }}
  response = &TestApiResponse{ }
  assert.NoError(t, TestApiRequest(RemoveArticle, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardId]
    if contactSet {
      _, articleSet := contact.articles[articleId]
      if !articleSet {
        return true
      }
    }
    return false
  }))

  // add a new article in contact
  article = &Article{}
  subject = &Subject{ Data: "subjectdataB", DataType: "subjectdatatypeB" }
  params = &TestApiParams{ restType: "POST", query: "/articles", tokenType: APP_TOKENAPP, token: set.B.Token, body: subject }
  response = &TestApiResponse{ data: article }
  assert.NoError(t, TestApiRequest(AddArticle, params, response))
  articleId = article.Id

  // share article
  article = &Article{}
  params = &TestApiParams{ restType: "POST", query: "/articles/{articleId}/groups/{groupId}", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "articleId": articleId, "groupId": set.B.A.GroupId }}
  response = &TestApiResponse{ data: article }
  assert.NoError(t, TestApiRequest(SetArticleGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardId]
    if contactSet {
      _, articleSet := contact.articles[articleId]
      if articleSet {
        return true
      }
    }
    return false
  }))

  // remove group in contact
  article = &Article{}
  params = &TestApiParams{ restType: "DELETE", query: "/groups/{groupId}", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "groupId": set.B.A.GroupId }}
  response = &TestApiResponse{ }
  assert.NoError(t, TestApiRequest(RemoveGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardId]
    if contactSet {
      _, articleSet := contact.articles[articleId]
      if !articleSet {
        return true
      }
    }
    return false
  }))

  // update Bs profile
  profileData = &ProfileData{ Name: "contactappname" }
  params = &TestApiParams{ restType: "PUT", query: "/profile/data", tokenType: APP_TOKENAPP, token: set.B.Token, body: profileData }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(SetProfile, params, response))

  // wait for
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    for _, contact := range testApp.contacts {
      if contact.card.Data.CardProfile.Name == "contactappname" {
        return true
      }
    }
    return false
  }))

  // disconnect from B
  card := &Card{}
  params = &TestApiParams{ restType: "PUT", query: "/contact/cards/{cardId}/status", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "cardId": set.B.A.CardId }, body: APP_CARDCONFIRMED }
  response = &TestApiResponse{ data: card }
  assert.NoError(t, TestApiRequest(SetCardStatus, params, response))
  msg := &DataMessage{}
  params = &TestApiParams { query: "/contact/cards/{cardId}/closeMessage", tokenType: APP_TOKENAPP, token: set.B.Token,
      path: map[string]string{ "cardId": set.B.A.CardId } }
  response = &TestApiResponse{ data: msg }
  assert.NoError(t, TestApiRequest(GetCloseMessage, params, response))
  params = &TestApiParams { restType: "PUT", query: "/contact/closeMessage", body: msg }
  response = &TestApiResponse{}
  assert.NoError(t, TestApiRequest(SetCloseMessage, params, response))

  // wait for
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardId]
    if contactSet && contact.card.Data.CardDetail.Status == APP_CARDCONFIRMED {
      return true
    }
    return false
  }))
}
