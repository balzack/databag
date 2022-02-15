package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestTopicShare(t *testing.T) {

  // setup testing group
  set, err := AddTestGroup("topicshare")
  assert.NoError(t, err)
  PrintMsg(set)
}
