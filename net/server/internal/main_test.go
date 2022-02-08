package databag

import (
  "os"
  "testing"
  "databag/internal/store"
)

func TestMain(m *testing.M) {

//  SetHideLog(true)
  SetKeySize(2048)
  os.Remove("databag.db")
  store.SetPath("databag.db")

  r, w, _ := NewRequest("GET", "/admin/status", nil)
  GetNodeStatus(w, r)
  var available bool
  if ReadResponse(w, &available) != nil {
    panic("server not claimable")
  }

  // claim server
  r, w, _ = NewRequest("PUT", "/admin/status", nil)
  SetCredentials(r, "admin:pass");
  SetNodeStatus(w, r)
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

  go SendNotifications()

  m.Run()

  ExitNotifications()
}

