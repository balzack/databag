package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestContactApp(t *testing.T) {
  var params *TestAPIParams
  var response *TestAPIResponse

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
  assert.NoError(t, APITestMsg(SetProfile, "PUT", "/profile/data", nil, profileData,
      APPTokenAgent, set.A.Token, nil, nil))

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
  params = &TestAPIParams{ restType: "POST", query: "/articles", tokenType: APPTokenAgent, token: set.A.Token, body: subject }
  response = &TestAPIResponse{ data: article }
  assert.NoError(t, TestAPIRequest(AddArticle, params, response))

  // wait for a
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    a, set := testApp.articles[article.ID]
    if set && a.Data.Data == "subjectdata" {
      return true
    }
    return false
  }))

  // remove a new article
  params = &TestAPIParams{ restType: "DELETE", query: "/articles/{articleID}", path: map[string]string{ "articleID": article.ID },
    tokenType: APPTokenAgent, token: set.A.Token, body: subject }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(RemoveArticle, params, response))

  // wait for a to be removed
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    if _, set := testApp.articles[article.ID]; !set {
      return true
    }
    return false
  }))

  // add a new article in contact
  article = &Article{}
  subject = &Subject{ Data: "subjectdataB", DataType: "subjectdatatypeB" }
  params = &TestAPIParams{ restType: "POST", query: "/articles", tokenType: APPTokenAgent, token: set.B.Token, body: subject }
  response = &TestAPIResponse{ data: article }
  assert.NoError(t, TestAPIRequest(AddArticle, params, response))
  articleID := article.ID

  // share article
  article = &Article{}
  params = &TestAPIParams{ restType: "POST", query: "/articles/{articleID}/groups/{groupID}", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "articleID": articleID, "groupID": set.B.A.GroupID }}
  response = &TestAPIResponse{ data: article }
  assert.NoError(t, TestAPIRequest(SetArticleGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet {
      _, articleSet := contact.articles[articleID]
      if articleSet {
        return true
      }
    }
    return false
  }))

  // remove new article in contact
  article = &Article{}
  params = &TestAPIParams{ restType: "DELETE", query: "/articles/{articleID}", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "articleID": articleID }}
  response = &TestAPIResponse{ }
  assert.NoError(t, TestAPIRequest(RemoveArticle, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet {
      _, articleSet := contact.articles[articleID]
      if !articleSet {
        return true
      }
    }
    return false
  }))

  // add a new article in contact
  article = &Article{}
  subject = &Subject{ Data: "subjectdataB", DataType: "subjectdatatypeB" }
  params = &TestAPIParams{ restType: "POST", query: "/articles", tokenType: APPTokenAgent, token: set.B.Token, body: subject }
  response = &TestAPIResponse{ data: article }
  assert.NoError(t, TestAPIRequest(AddArticle, params, response))
  articleID = article.ID

  // share article
  article = &Article{}
  params = &TestAPIParams{ restType: "POST", query: "/articles/{articleID}/groups/{groupID}", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "articleID": articleID, "groupID": set.B.A.GroupID }}
  response = &TestAPIResponse{ data: article }
  assert.NoError(t, TestAPIRequest(SetArticleGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet {
      _, articleSet := contact.articles[articleID]
      if articleSet {
        return true
      }
    }
    return false
  }))

  // remove group in contact
  article = &Article{}
  params = &TestAPIParams{ restType: "DELETE", query: "/groups/{groupID}", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "groupID": set.B.A.GroupID }}
  response = &TestAPIResponse{ }
  assert.NoError(t, TestAPIRequest(RemoveGroup, params, response))

  // wait for 
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet {
      _, articleSet := contact.articles[articleID]
      if !articleSet {
        return true
      }
    }
    return false
  }))

  // update Bs profile
  profileData = &ProfileData{ Name: "contactappname" }
  params = &TestAPIParams{ restType: "PUT", query: "/profile/data", tokenType: APPTokenAgent, token: set.B.Token, body: profileData }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(SetProfile, params, response))

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
  params = &TestAPIParams{ restType: "PUT", query: "/contact/cards/{cardID}/status", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "cardID": set.B.A.CardID }, body: APPCardConfirmed }
  response = &TestAPIResponse{ data: card }
  assert.NoError(t, TestAPIRequest(SetCardStatus, params, response))
  msg := &DataMessage{}
  params = &TestAPIParams { query: "/contact/cards/{cardID}/closeMessage", tokenType: APPTokenAgent, token: set.B.Token,
      path: map[string]string{ "cardID": set.B.A.CardID } }
  response = &TestAPIResponse{ data: msg }
  assert.NoError(t, TestAPIRequest(GetCloseMessage, params, response))
  params = &TestAPIParams { restType: "PUT", query: "/contact/closeMessage", body: msg }
  response = &TestAPIResponse{}
  assert.NoError(t, TestAPIRequest(SetCloseMessage, params, response))

  // wait for
  assert.NoError(t, app.WaitFor(func(testApp *TestApp)bool {
    contact, contactSet := testApp.contacts[set.A.B.CardID]
    if contactSet && contact.card.Data.CardDetail.Status == APPCardConfirmed {
      return true
    }
    return false
  }))
}
