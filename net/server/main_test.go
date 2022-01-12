package main

import (
  "testing"
  "net/http/httptest"
  app "databag/internal"
  store "databag/internal/store"
)

func TestClaim(t *testing.T) {

  store.SetPath("file::memory:?cache=shared");

  r := httptest.NewRequest("GET", "/claimable", nil)
  w := httptest.NewRecorder()
  app.GetNodeClaimable(w, r);
  if w.Code != 200 {
    t.Errorf("server not initially claimable");
  }
}

