package databag

import (
  "strings"
  "testing"
  "net/http/httptest"
  "encoding/base64"
  "encoding/json"
  "databag/internal/store"
)

func TestMain(m *testing.M) {

  store.SetPath("file::memory:?cache=shared");
  //store.SetPath("databag.db");

  Claimable();
  Claim();
  SetConfig();
  GetConfig();

  m.Run()
}

func Claimable() {
  r := httptest.NewRequest("GET", "/admin/claimable", nil)
  w := httptest.NewRecorder()
  GetNodeClaimable(w, r)

  //body, _ := ioutil.ReadAll(resp.Body)
  resp := w.Result()
  dec := json.NewDecoder(resp.Body);
  var res bool
  err := dec.Decode(&res)
  if err != nil {
    panic("failed to get claimable response")
  }
  if resp.StatusCode != 200 {
    panic("server not initially claimable")
  }
}

func Claim() {
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("PUT", "/admin/claim", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  SetNodeClaim(w, r)
  if w.Code != 200 {
    panic("server not initially claimable")
  }
}

func SetConfig() {
  config := NodeConfig{Domain: "example.com", PublicLimit: 1024, AccountStorage: 4096}
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  body,_ := json.Marshal(config)
  r := httptest.NewRequest("PUT", "/admin/config", strings.NewReader(string(body)))
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  SetNodeConfig(w, r);
  if w.Code != 200 {
    panic("failed to set node config")
  }
}

func GetConfig() {
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("GET", "/admin/config", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  GetNodeConfig(w, r);

  resp := w.Result();
  dec := json.NewDecoder(resp.Body);
  var config NodeConfig;
  dec.Decode(&config);
  if resp.StatusCode != 200 {
    panic("failed to get node config")
  }
  if config.Domain != "example.com" {
    panic("failed to set config domain");
  }
  if config.PublicLimit != 1024 {
    panic("failed to set public limit");
  }
  if config.AccountStorage != 4096 {
    panic("failed to set account storage");
  }
}
