package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

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
    assert.NoError(t, ReadResponse(w, nil))

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

    access = append(access, token)
  }

  return access
}
