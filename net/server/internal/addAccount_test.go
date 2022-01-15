package databag

import (
  "fmt"
  "testing"
  "net/http/httptest"
  "encoding/base64"
  "encoding/json"
)

func TestAccount(t *testing.T) {

  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("POST", "/admin/accounts", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  AddNodeAccount(w, r);

  resp := w.Result();
  dec := json.NewDecoder(resp.Body);
  var token string;
  dec.Decode(&token);
  if resp.StatusCode != 200 {
    t.Errorf("failed to create account")
  }

  fmt.Println(token);
}
