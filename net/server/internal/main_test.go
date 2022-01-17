package databag

import (
  "testing"
  "databag/internal/store"
)

func TestMain(m *testing.M) {

  hideLog = true
  store.SetPath("file::memory:?cache=shared");
  //store.SetPath("databag.db");

  r, w, _ := NewRequest("GET", "/admin/claimable", nil)
  GetNodeClaimable(w, r)
  var available bool
  if ReadResponse(w, &available) != nil {
    panic("server not claimable")
  }

  // claim server
  r, w, _ = NewRequest("PUT", "/admin/claim", nil)
  SetCredentials(r, "admin:pass");
  SetNodeClaim(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to claim server")
  }

  // config server
  config := NodeConfig{Domain: "example.com", PublicLimit: 1024, AccountStorage: 4096}
  r, w, _ = NewRequest("PUT", "/admin/config", &config)
  SetBasicAuth(r, "admin:pass")
  SetNodeConfig(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to set config")
  }

  // check config
  r, w, _ = NewRequest("GET", "/admin/config", nil)
  SetBasicAuth(r, "admin:pass")
  GetNodeConfig(w, r)
  var check NodeConfig
  if ReadResponse(w, &check) != nil {
    panic("failed to get node config")
  }
  if check.Domain != "example.com" {
    panic("failed to set config domain");
  }
  if check.PublicLimit != 1024 {
    panic("failed to set public limit");
  }
  if check.AccountStorage != 4096 {
    panic("failed to set account storage");
  }

  // get account token
  r, w, _ = NewRequest("POST", "/admin/accounts", nil)
  SetBasicAuth(r, "admin:pass")
  AddNodeAccount(w, r)
  var token string
  if ReadResponse(w, &token) != nil {
    panic("failed to create token")
  }

  // set account profile
  r, w, _ = NewRequest("GET", "/account/profile", nil)
  SetBearerAuth(r, token);
  SetCredentials(r, "test:pass")
  AddAccount(w, r)
  if ReadResponse(w, nil) != nil {
    panic("failed to create account")
  }

  m.Run()
}

