package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAttachAccount(t *testing.T) {

  // acquire new token for attaching app
  r, w, _ := NewRequest("POST", "/account/apps", nil)
  SetBasicAuth(r, "user:pass");
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

PrintMsg(access)
  // autorize app

  // set profile
}

