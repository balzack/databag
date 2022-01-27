package databag

import (
  "errors"
  "testing"
  "strconv"
  "net/http"
  "net/http/httptest"
  "github.com/gorilla/mux"
  "github.com/stretchr/testify/assert"
)

type TestAccount struct {
  AppToken string
  ContactGuid string
  ContactToken string
  ContactCardId string
}

type TestCard struct {
  Guid string
  Token string
  CardId string
  GroupId string
}

type TestContact struct {
  Guid string
  Token string
  A TestCard
  B TestCard
  C TestCard
  D TestCard
}

type TestGroup struct {
  A TestContact
  B TestContact
  C TestContact
  D TestContact
}

// A-B
// |x|
// C-D
//
// A: B[connected,group] : C[requested,group] : D[requested,nogroup]
// B: A[connected,group] : C[confirmed,group] : D[,]
// C: A[confirmed,group] : B[confirmed,nogroup] : D[connected,group]
// D: A[pending,nogroup] : B[,] : C[connected,group]
func AddTestGroup(prefix string) (*TestGroup, error) {
    var err error

    // allocate contacts
    g := &TestGroup{}
    if g.A.Guid, g.A.Token, err = AddTestAccount(prefix+"A"); err != nil {
      return g, err
    }
    if g.B.Guid, g.B.Token, err = AddTestAccount(prefix+"B"); err != nil {
      return g, err
    }
    if g.C.Guid, g.C.Token, err = AddTestAccount(prefix+"C"); err != nil {
      return g, err
    }
    if g.D.Guid, g.D.Token, err = AddTestAccount(prefix+"D"); err != nil {
      return g, err
    }

    // setup A
    if g.A.B.CardId, err = AddTestCard(g.A.Token, g.B.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.A.Token, g.A.B.CardId); err != nil {
      return g, err
    }
    if g.A.B.GroupId, err = GroupTestCard(g.A.Token, g.A.B.CardId); err != nil {
      return g, err
    }
    if g.A.C.CardId, err = AddTestCard(g.A.Token, g.C.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.A.Token, g.A.C.CardId); err != nil {
      return g, err
    }
    if g.A.C.GroupId, err = GroupTestCard(g.A.Token, g.A.C.CardId); err != nil {
      return g, err
    }
    if g.A.D.CardId, err = AddTestCard(g.A.Token, g.D.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.A.Token, g.A.D.CardId); err != nil {
      return g, err
    }

    // setup B
    if g.B.A.CardId, err = AddTestCard(g.B.Token, g.A.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.B.Token, g.B.A.CardId); err != nil {
      return g, err
    }
    if g.B.A.GroupId, err = GroupTestCard(g.B.Token, g.B.A.CardId); err != nil {
      return g, err
    }
    if g.B.C.CardId, err = AddTestCard(g.B.Token, g.C.Token); err != nil {
      return g, err
    }
    if g.B.C.GroupId, err = GroupTestCard(g.B.Token, g.B.C.CardId); err != nil {
      return g, err
    }

    // setup C
    if g.C.D.CardId, err = AddTestCard(g.C.Token, g.D.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.C.Token, g.C.D.CardId); err != nil {
      return g, err
    }
    if g.C.D.GroupId, err = GroupTestCard(g.C.Token, g.C.D.CardId); err != nil {
      return g, err
    }
    if g.C.A.CardId, err = AddTestCard(g.C.Token, g.A.Token); err != nil {
      return g, err
    }
    if g.C.A.GroupId, err = GroupTestCard(g.C.Token, g.C.A.CardId); err != nil {
      return g, err
    }
    if g.C.B.CardId, err = AddTestCard(g.C.Token, g.B.Token); err != nil {
      return g, err
    }

    // setup D
    if g.D.C.CardId, err = AddTestCard(g.D.Token, g.C.Token); err != nil {
      return g, err
    }
    if err = OpenTestCard(g.D.Token, g.D.C.CardId); err != nil {
      return g, err
    }
    if g.D.C.GroupId, err = GroupTestCard(g.D.Token, g.D.C.CardId); err != nil {
      return g, err
    }

    // get contact tokens
    if g.A.B.Token, err = GetCardToken(g.A.Token, g.A.B.CardId); err != nil {
      return g, err
    }
    if g.B.A.Token, err = GetCardToken(g.B.Token, g.B.A.CardId); err != nil {
      return g, err
    }
    if g.C.D.Token, err = GetCardToken(g.C.Token, g.C.D.CardId); err != nil {
      return g, err
    }
    if g.D.C.Token, err = GetCardToken(g.D.Token, g.D.C.CardId); err != nil {
      return g, err
    }

    return g, nil
}
func GetCardToken(account string, cardId string) (token string, err error) {
  var r *http.Request
  var w *httptest.ResponseRecorder
  var card Card
  vars := make(map[string]string)

  if r, w, err = NewRequest("GET", "/contact/cards/{cardId}", nil); err != nil {
    return
  }
  vars["cardId"] = cardId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, account)
  GetCard(w, r)
  if err = ReadResponse(w, &card); err != nil {
    return
  }
  if card.CardData.Status != APP_CARDCONNECTED {
    err = errors.New("card not connected")
    return
  }
  token = card.CardProfile.Guid + "." + card.CardData.Token
  return
}
func GroupTestCard(account string, cardId string) (groupId string, err error) {
  var r *http.Request
  var w *httptest.ResponseRecorder
  var subject *Subject
  var group Group
  var cardData CardData
  vars := make(map[string]string)

  // add new group
  subject = &Subject{
    DataType: "imagroup",
    Data: "group data with name and logo",
  }
  if r, w, err = NewRequest("POST", "/share/groups", subject); err != nil {
    return
  }
  SetBearerAuth(r, account)
  AddGroup(w, r)
  if err = ReadResponse(w, &group); err != nil {
    return
  }
  groupId = group.GroupId

  // set contact group
  if r, w, err = NewRequest("PUT", "/contact/cards/{cardId}/groups/{groupId}", nil); err != nil {
    return
  }
  vars["groupId"] = group.GroupId
  vars["cardId"] = cardId
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, account)
  SetCardGroup(w, r)
  if err = ReadResponse(w, &cardData); err != nil {
    return
  }
  return
}
func OpenTestCard(account string, cardId string) (err error) {
  var r *http.Request
  var w *httptest.ResponseRecorder
  var msg DataMessage
  var card Card
  var vars = map[string]string{ "cardId": cardId }
  var contactStatus ContactStatus

  // set to connecting state
  if r, w, err = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING); err != nil {
    return
  }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, account)
  SetCardStatus(w, r)
  if err = ReadResponse(w, &card); err != nil {
    return
  }

  // get open message
  if r, w, err = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil); err != nil {
    return
  }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, account)
  GetOpenMessage(w, r)
  if err = ReadResponse(w, &msg); err != nil {
    return
  }

  // set open message 
  if r, w, err = NewRequest("PUT", "/contact/openMessage", msg); err != nil {
    return
  }
  SetOpenMessage(w, r)
  if err = ReadResponse(w, &contactStatus); err != nil {
    return
  }

  // update status if connected
  if contactStatus.Status == APP_CARDCONNECTED {
    if r, w, err = NewRequest("PUT", "/contact/cards/{cardId}/status?token=" + contactStatus.Token, APP_CARDCONNECTED); err != nil {
      return
    }
    r = mux.SetURLVars(r, vars)
    SetBearerAuth(r, account)
    SetCardStatus(w, r)
    if err = ReadResponse(w, &card); err != nil {
      return
    }
  }
  return
}
func AddTestCard(account string, contact string) (cardId string, err error) {
  var r *http.Request
  var w *httptest.ResponseRecorder
  var msg DataMessage
  var card Card

  // get A identity message
  if r, w, err = NewRequest("GET", "/profile/message", nil); err != nil {
    return
  }
  r.Header.Add("TokenType", APP_TOKENAPP)
  SetBearerAuth(r, contact)
  GetProfileMessage(w, r)
  if err = ReadResponse(w, &msg); err != nil {
    return
  }

  // add A card in B
  if r, w, err = NewRequest("POST", "/contact/cards", &msg); err != nil {
    return
  }
  SetBearerAuth(r, account)
  AddCard(w, r)
  if err = ReadResponse(w, &card); err != nil {
    return
  }
  cardId = card.CardId
  return
}
func AddTestAccount(username string) (guid string, token string, err error) {
  var r *http.Request
  var w *httptest.ResponseRecorder

  var access string
  app := AppData{
    Name: "Appy",
    Description: "A test app",
    Url: "http://app.example.com",
  };
  var profile Profile
  var login = username + ":pass"

  // get account token
  if r, w, err= NewRequest("POST", "/admin/accounts", nil); err != nil {
    return
  }
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  if err = ReadResponse(w, &access); err != nil {
    return
  }

  // set account profile
  if r, w, err = NewRequest("GET", "/account/profile", nil); err != nil {
    return
  }
  SetBearerAuth(r, access);
  SetCredentials(r, login)
  AddAccount(w, r)
  if err = ReadResponse(w, &profile); err != nil {
    return
  }
  guid = profile.Guid

  // acquire new token for attaching app
  if r, w, err = NewRequest("POST", "/account/apps", nil); err != nil {
    return
  }
  SetBasicAuth(r, login);
  AddAccountApp(w, r);
  if err = ReadResponse(w, &access); err != nil {
    return
  }

  // attach app with token
  if r, w, err = NewRequest("PUT", "/account/apps", &app); err != nil {
    return
  }
  SetBearerAuth(r, access)
  SetAccountApp(w, r)
  if err = ReadResponse(w, &access); err != nil {
    return
  }
  token = guid + "." + access
  return
}





func AddTestContacts(t *testing.T, prefix string, count int) []string {

  var access []string
  app := AppData{
    Name: "Appy",
    Description: "A test app",
    Url: "http://app.example.com",
  };

  for i := 0; i < count; i++ {
    var token string
    var login = prefix + strconv.Itoa(i) + ":pass"

    // get account token
    r, w, _ := NewRequest("POST", "/admin/accounts", nil)
    SetBasicAuth(r, "admin:pass")
    AddNodeAccount(w, r)
    assert.NoError(t, ReadResponse(w, &token))

    // set account profile
    r, w, _ = NewRequest("GET", "/account/profile", nil)
    SetBearerAuth(r, token);
    SetCredentials(r, login)
    AddAccount(w, r)
    var profile Profile
    assert.NoError(t, ReadResponse(w, &profile))

    // acquire new token for attaching app
    r, w, _ = NewRequest("POST", "/account/apps", nil)
    SetBasicAuth(r, login);
    AddAccountApp(w, r);
    assert.NoError(t, ReadResponse(w, &token))

    // attach app with token
    r, w, _ = NewRequest("PUT", "/account/apps", &app)
    SetBearerAuth(r, token)
    SetAccountApp(w, r)
    assert.NoError(t, ReadResponse(w, &token))

    access = append(access, profile.Guid + "." + token)
  }

  return access
}

func ConnectTestContacts(t *testing.T, accessA string, accessB string) (contact [2]TestAccount) {
  var card Card
  var msg DataMessage
  var vars map[string]string
  var contactStatus ContactStatus
  var id string
  contact[0].AppToken = accessA
  contact[1].AppToken = accessB

  // get A identity message
  r, w, _ := NewRequest("GET", "/profile/message", nil)
  r.Header.Add("TokenType", APP_TOKENAPP)
  SetBearerAuth(r, accessA)
  GetProfileMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // add A card in B
  r, w, _ = NewRequest("POST", "/contact/cards", &msg)
  SetBearerAuth(r, accessB)
  AddCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  contact[1].ContactCardId = card.CardId
  contact[1].ContactGuid = card.CardProfile.Guid

  // update A status to connecting
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessB)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // get open message to A
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil)
  vars = map[string]string{ "cardId": card.CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessB)
  GetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))
  id = card.CardId

  // set open message in A
  r, w, _ = NewRequest("PUT", "/contact/openMessage", msg)
  SetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &contactStatus))

  // get view of cards in A
  r, w, _ = NewRequest("GET", "/contact/cards/view", nil)
  SetBearerAuth(r, accessA)
  GetCardView(w, r)
  var views []CardView
  assert.NoError(t, ReadResponse(w, &views))
  assert.Equal(t, len(views), 1)

  // get B card in A
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessA)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  contact[0].ContactCardId = card.CardId
  contact[0].ContactGuid = card.CardProfile.Guid

  // update B status to connecting
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status", APP_CARDCONNECTING)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessA)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // get open message to B
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}/openMessage", nil)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessA)
  GetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &msg))

  // set open message in B
  r, w, _ = NewRequest("PUT", "/contact/openMessage", msg)
  SetOpenMessage(w, r)
  assert.NoError(t, ReadResponse(w, &contactStatus))
  assert.Equal(t, APP_CARDCONNECTED, contactStatus.Status)

  // update B status to connected
  r, w, _ = NewRequest("PUT", "/contact/cards/{cardId}/status?token=" + contactStatus.Token, APP_CARDCONNECTED)
  vars = map[string]string{ "cardId": views[0].CardId }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessA)
  SetCardStatus(w, r)
  assert.NoError(t, ReadResponse(w, &card))

  // extract contact tokens
  contact[0].ContactToken = card.CardData.Token
  r, w, _ = NewRequest("GET", "/contact/cards/{cardId}", nil)
  vars = map[string]string{ "cardId": id }
  r = mux.SetURLVars(r, vars)
  SetBearerAuth(r, accessB)
  GetCard(w, r)
  assert.NoError(t, ReadResponse(w, &card))
  contact[1].ContactToken = card.CardData.Token

  return
}
