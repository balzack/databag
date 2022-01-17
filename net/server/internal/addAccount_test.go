package databag

import (
  "testing"
  "net/http/httptest"
  "encoding/base64"
)

func TestAddAccount(t *testing.T) {

  // acquire new token for creating accounts
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("POST", "/admin/accounts", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  AddNodeAccount(w, r)
  var token string
  if ReadResponse(w, &token) != nil {
    t.Errorf("failed to create token");
    return
  }

  // validate account token
  r = httptest.NewRequest("GET", "/account/token", nil)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
  GetAccountToken(w, r)
  var tokenType string
  if ReadResponse(w, &tokenType) != nil {
    t.Errorf("failed to validate token")
    return
  }

  // check if username is available
  r = httptest.NewRequest("GET", "/account/claimable?username=user", nil)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
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
  auth = base64.StdEncoding.EncodeToString([]byte("user:pass"))
  r = httptest.NewRequest("GET", "/account/profile", nil)
  r.Header.Add("Credentials","Basic " + auth)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
  AddAccount(w, r)
  var profile Profile
  if ReadResponse(w, &profile) != nil {
    t.Errorf("failed to create account")
    return
  }

  // acquire new token for creating accounts
  auth = base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r = httptest.NewRequest("POST", "/admin/accounts", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w = httptest.NewRecorder()
  AddNodeAccount(w, r)
  if ReadResponse(w, &token) != nil {
    t.Errorf("failed to create token")
    return
  }

  // check if dup is available
  r = httptest.NewRequest("GET", "/account/claimable?username=user", nil)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
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
  auth = base64.StdEncoding.EncodeToString([]byte("user:pass"))
  r = httptest.NewRequest("GET", "/account/profile", nil)
  r.Header.Add("Credentials","Basic " + auth)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
  AddAccount(w, r)
  if ReadResponse(w, &profile) == nil {
    t.Errorf("duplicate handle set")
    return
  }

}
