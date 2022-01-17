package databag

import (
  "testing"
)

func TestAddAccount(t *testing.T) {

  // acquire new token for creating accounts
  r, w, _ := NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass");
  AddNodeAccount(w, r)
  var token string
  if ReadResponse(w, &token) != nil {
    t.Errorf("failed to create token");
    return
  }

  // validate account token
  r, w, _ = NewRequest("GET", "/account/token", nil)
  SetBearerAuth(r, token)
  GetAccountToken(w, r)
  var tokenType string
  if ReadResponse(w, &tokenType) != nil {
    t.Errorf("failed to validate token")
    return
  }

  // check if username is available
  r, w, _ = NewRequest("GET", "/account/claimable?username=user", nil)
  SetBearerAuth(r, token)
  GetAccountUsername(w, r)
  var available bool
  if ReadResponse(w, &available) != nil {
    t.Errorf("failed to check username")
    return
  }
  if !available {
    t.Errorf("username not available")
    return
  }

  // create account
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetCredentials(r, "user:pass")
  SetBearerAuth(r, token)
  AddAccount(w, r)
  var profile Profile
  if ReadResponse(w, &profile) != nil {
    t.Errorf("failed to create account")
    return
  }

  // acquire new token for creating accounts
  r, w, _ = NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  if ReadResponse(w, &token) != nil {
    t.Errorf("failed to create token")
    return
  }

  // check if dup is available
  r, w, _ = NewRequest("GET", "/account/claimable?username=user", nil)
  SetBearerAuth(r, token)
  GetAccountUsername(w, r)
  if ReadResponse(w, &available) != nil {
    t.Errorf("failed to check username")
    return
  }
  if available {
    t.Errorf("username duplicate available")
    return
  }

  // create dup account
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetCredentials(r, "user:pass")
  SetBearerAuth(r, token);
  AddAccount(w, r)
  if ReadResponse(w, &profile) == nil {
    t.Errorf("duplicate handle set")
    return
  }

}
