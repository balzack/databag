package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestUpdateProfile(t *testing.T) {
  // setup testing group
  set, err := AddTestGroup("updateprofile")
  assert.NoError(t, err)

  PrintMsg(set)
}
