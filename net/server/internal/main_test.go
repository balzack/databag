package databag

import (
  "testing"
  "databag/internal/store"
)

func TestMain(m *testing.M) {

  hideLog = true
  store.SetPath("file::memory:?cache=shared");
  //store.SetPath("databag.db");

  Claimable();
  Claim();
  SetConfig();
  GetConfig();
  token := SetToken()
  SetAccount(token)
  m.Run()
}

func Claimable() {
  r, w, _ := NewRequest("GET", "/admin/claimable", nil)
  GetNodeClaimable(w, r)
  var available bool
  if ReadResponse(w, &available) != nil {
    panic("server not claimable")
  }
}

func Claim() {
  r, w, _ := NewRequest("PUT", "/admin/claim", nil)
  SetCredentials(r, "admin:pass");
  SetNodeClaim(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to claim server")
  }
}

func SetConfig() {
  config := NodeConfig{Domain: "example.com", PublicLimit: 1024, AccountStorage: 4096}
  r, w, _ := NewRequest("PUT", "/admin/config", &config)
  SetBasicAuth(r, "admin:pass")
  SetNodeConfig(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to set config")
  }
}

func GetConfig() {
  r, w, _ := NewRequest("GET", "/admin/config", nil)
  SetBasicAuth(r, "admin:pass")
  GetNodeConfig(w, r)
  var config NodeConfig
  if ReadResponse(w, &config) != nil {
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

func SetToken() string {
  r, w, _ := NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  var token string
  if ReadResponse(w, &token) != nil {
    panic("failed to create token")
  }
  return token
}

func SetAccount(token string) {
  r, w, _ := NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, token);
  SetCredentials(r, "test:pass")
  AddAccount(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to create account")
  }
}
