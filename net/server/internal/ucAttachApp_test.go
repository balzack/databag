package databag

import (
  "testing"
  "encoding/json"
  "time"
  "github.com/gorilla/websocket"
  "github.com/stretchr/testify/assert"
)

func TestAttachAccount(t *testing.T) {

  // get account token
  r, w, _ := NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  var account string
  assert.NoError(t, ReadResponse(w, &account))

  // set account profile
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, account);
  SetCredentials(r, "attachapp:pass")
  AddAccount(w, r)
  assert.NoError(t, ReadResponse(w, nil))

  // acquire new token for attaching app
  r, w, _ = NewRequest("POST", "/account/apps", nil)
  SetBasicAuth(r, "attachapp:pass");
  AddAccountApp(w, r);
  var token string
  assert.NoError(t, ReadResponse(w, &token))

  // attach app with token
  app := AppData{
    Name: "Appy",
    Description: "A test app",
    Url: "http://app.example.com",
  };
  r, w, _ = NewRequest("PUT", "/account/apps", &app)
  SetBearerAuth(r, token)
  SetAccountApp(w, r)
  var access string
  assert.NoError(t, ReadResponse(w, &access))

  // autorize app
  r, w, _ = NewRequest("PUT", "/authorize", "aabbccdd")
  SetBearerAuth(r, access)
  Authorize(w, r);
  var message DataMessage
  assert.NoError(t, ReadResponse(w, &message))

  // validate message
  var auth Authenticate
  guid, msgType, ts, err := ReadDataMessage(&message, &auth)
  if err != nil {
    PrintMsg(err)
  }
  cur := time.Now().Unix()
  assert.GreaterOrEqual(t, cur, ts)
  assert.Less(t, cur - 60, ts)
  assert.Equal(t, "aabbccdd", auth.Token)
  assert.Equal(t, msgType, APP_MSGAUTHENTICATE)

  // app connects websocket
  ws := getTestWebsocket()
  announce := Announce{ AppToken: access }
  msg, _ := json.Marshal(&announce)
  ws.WriteMessage(websocket.TextMessage, msg)
  _, msg, _ = ws.ReadMessage()
  var revision Revision
  assert.NoError(t, json.Unmarshal(msg, &revision))
  profileRevision := revision.Profile

  // set profile
  profileData := ProfileData{
    Name: "Namer",
    Location: "San Francisco",
    Description: "databaggerr",
  };
  r, w, _ = NewRequest("PUT", "/profile/data", &profileData)
  SetBearerAuth(r, access)
  SetProfile(w, r)
  assert.NoError(t, ReadResponse(w, nil))

  // get profile
  r, w, _ = NewRequest("GET", "/profile", nil)
  SetBearerAuth(r, access)
  GetProfile(w, r)
  var profile Profile
  assert.NoError(t, ReadResponse(w, &profile))
  assert.Equal(t, guid, profile.Guid)
  assert.Equal(t, "attachapp", profile.Handle)
  assert.Equal(t, "Namer", profile.Name)

  // profile revision incremented
  _, msg, _ = ws.ReadMessage()
  assert.NoError(t, json.Unmarshal(msg, &revision))
  assert.NotEqual(t, profileRevision, revision.Profile)
}

