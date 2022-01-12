package main

import (
  "fmt"
  "testing"
  "net/http/httptest"
  "encoding/base64"
  app "databag/internal"
  store "databag/internal/store"
)

func TestSetup(t *testing.T) {

  store.SetPath("file::memory:?cache=shared");
  Claimable(t);
  Claim(t);
}

func Claimable(t *testing.T) {
  r := httptest.NewRequest("GET", "/claimable", nil)
  w := httptest.NewRecorder()
  app.GetNodeClaimable(w, r);
  if w.Code != 200 {
    t.Errorf("server not initially claimable");
  }
}

func Claim(t *testing.T) {
  auth := base64.StdEncoding.EncodeToString([]byte("admin:pass"))
  r := httptest.NewRequest("GET", "/claimable", nil)
  r.Header.Add("Authorization","Basic " + auth)
  w := httptest.NewRecorder()
  app.GetNodeClaimable(w, r);
  if w.Code != 200 {
    t.Errorf("server not initially claimable");
  }

}
