package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddAccount(t *testing.T) {

PrintMsg("ADD")

  // acquire new token for creating accounts
  r, w, _ := NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass");
  AddNodeAccount(w, r)
  var token string
  assert.NoError(t, ReadResponse(w, &token))

  // validate account token
  r, w, _ = NewRequest("GET", "/account/token", nil)
  SetBearerAuth(r, token)
  GetAccountToken(w, r)
  var tokenType string
  assert.NoError(t, ReadResponse(w, &tokenType))

  // check if username is available
  r, w, _ = NewRequest("GET", "/account/claimable?username=addaccount", nil)
  SetBearerAuth(r, token)
  GetAccountUsername(w, r)
  var available bool
  assert.NoError(t, ReadResponse(w, &available))
  assert.True(t, available)

  // create account
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetCredentials(r, "addaccount:pass")
  SetBearerAuth(r, token)
  AddAccount(w, r)
  var profile Profile
  assert.NoError(t, ReadResponse(w, &profile))

  // acquire new token for creating accounts
  r, w, _ = NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  assert.NoError(t, ReadResponse(w, &token))

  // check if dup is available
  r, w, _ = NewRequest("GET", "/account/claimable?username=addaccount", nil)
  SetBearerAuth(r, token)
  GetAccountUsername(w, r)
  assert.NoError(t, ReadResponse(w, &available))
  assert.False(t, available);

  // create dup account
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetCredentials(r, "addaccount:pass")
  SetBearerAuth(r, token);
  AddAccount(w, r)
  assert.Error(t, ReadResponse(w, &profile))
}
