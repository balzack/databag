package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestConnectContact(t *testing.T) {

 app := AppData{
    Name: "Appy",
    Description: "A test app",
    Url: "http://app.example.com",
  };
 var token string

  // get account token
  r, w, _ := NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  assert.NoError(t, ReadResponse(w, &token))

  // set account profile
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, token);
  SetCredentials(r, "connecta:pass")
  AddAccount(w, r)
  assert.NoError(t, ReadResponse(w, nil))

  // acquire new token for attaching app
  r, w, _ = NewRequest("POST", "/account/apps", nil)
  SetBasicAuth(r, "attachapp:pass");
  AddAccountApp(w, r);
  assert.NoError(t, ReadResponse(w, &token))

  // attach app with token
  r, w, _ = NewRequest("PUT", "/account/apps", &app)
  SetBearerAuth(r, token)
  SetAccountApp(w, r)
  var aToken string
  assert.NoError(t, ReadResponse(w, &aToken))

  // get account token
  r, w, _ = NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  assert.NoError(t, ReadResponse(w, &token))

  // set account profile
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, token);
  SetCredentials(r, "connectb:pass")
  AddAccount(w, r)
  assert.NoError(t, ReadResponse(w, nil))

  // acquire new token for attaching app
  r, w, _ = NewRequest("POST", "/account/apps", nil)
  SetBasicAuth(r, "attachapp:pass");
  AddAccountApp(w, r);
  assert.NoError(t, ReadResponse(w, &token))

  // attach app with token
  r, w, _ = NewRequest("PUT", "/account/apps", &app)
  SetBearerAuth(r, token)
  SetAccountApp(w, r)
  var bToken string
  assert.NoError(t, ReadResponse(w, &bToken))



  // get B profile message

  // set B card in A

  // get A open message

  // set A card in B

  // accept A

}

