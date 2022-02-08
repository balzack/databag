package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestUpdateContact(t *testing.T) {
  // setup testing group
  _, err := AddTestGroup("updatecontact")
  assert.NoError(t, err)
}
