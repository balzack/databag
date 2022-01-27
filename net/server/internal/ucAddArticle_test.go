package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {

    set, err := AddTestGroup("addaccount")
    assert.NoError(t, err)
    PrintMsg(set)
}
