package databag

import (
  "testing"
  "net/http/httptest"
  "encoding/base64"
  "encoding/json"
)

func TestAccount(t *testing.T) {

  // acquire new token for creating accounts
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("POST", "/admin/accounts", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  AddNodeAccount(w, r)
  resp := w.Result()
  dec := json.NewDecoder(resp.Body)
  var token string
  dec.Decode(&token)
  if resp.StatusCode != 200 {
    t.Errorf("failed to create account")
    return
  }

  // validate account token
  r = httptest.NewRequest("GET", "/account/token", nil)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
  GetAccountToken(w, r)
  resp = w.Result()
  if resp.StatusCode != 200 {
    t.Errorf("invalid token value")
    return
  }
  dec = json.NewDecoder(resp.Body)
  var tokenType string
  dec.Decode(&tokenType)
  if tokenType != "create" {
    t.Errorf("invalid token type")
    return
  }

  // check if username is available
  r = httptest.NewRequest("GET", "/account/claimable?username=user", nil)
  r.Header.Add("Authorization","Bearer " + token)
  w = httptest.NewRecorder()
  GetAccountUsername(w, r)
  resp = w.Result()
  if resp.StatusCode != 200 {
    t.Errorf("invalid token value")
    return
  }
  dec = json.NewDecoder(resp.Body)
  var available bool
  dec.Decode(&available)
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
  resp = w.Result()
  if resp.StatusCode != 200 {
    t.Errorf("invalid token value")
    return
  }
  dec = json.NewDecoder(resp.Body)
  var profile Profile
  dec.Decode(&profile)
  if profile.Guid == nil {
    t.Errorf("invalid profile")
    return
  }
}
