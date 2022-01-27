package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {
  var set *TestGroup
  var err error

  set, err = AddTestGroup("addaccount1")
  assert.NoError(t, err)
  PrintMsg(set)
}
