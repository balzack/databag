package databag

import (
  "testing"
  "encoding/hex"
  "encoding/json"
  "encoding/base64"
  "crypto/sha256"
  "crypto/rsa"
  "crypto"
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
  if ReadResponse(w, &account) != nil {
    panic("failed to create token")
  }

  // set account profile
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, account);
  SetCredentials(r, "attachapp:pass")
  AddAccount(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to create account")
  }

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
  assert.Equal(t, "RSA4096", message.KeyType)
  assert.Equal(t, "PKCS1v15", message.SignatureType)
  var data []byte
  var hash [32]byte
  data, _ = base64.StdEncoding.DecodeString(message.PublicKey)
  hash = sha256.Sum256(data)
  guid := hex.EncodeToString(hash[:])
  publicKey, _ := ParseRsaPublicKeyFromPemStr(string(data))
  signature, _ := base64.StdEncoding.DecodeString(message.Signature)
  data, _ = base64.StdEncoding.DecodeString(message.Message)
  hash = sha256.Sum256(data)
  assert.NoError(t, rsa.VerifyPKCS1v15(publicKey, crypto.SHA256, hash[:], signature))
  var auth Authenticate
  assert.NoError(t, json.Unmarshal(data,&auth))
  assert.Equal(t, "aabbccdd", auth.Token)
  assert.Equal(t, guid, auth.Guid)
  cur := time.Now().Unix()
  assert.GreaterOrEqual(t, cur, auth.Timestamp)
  assert.Less(t, cur - 60, auth.Timestamp)

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

