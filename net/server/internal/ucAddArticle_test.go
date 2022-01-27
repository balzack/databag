package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {
  var set *TestGroup
  var err error
  var rev *Revision

  // setup testing group
  set, err = AddTestGroup("addarticle1")
  assert.NoError(t, err)
  rev = GetTestRevision(set.A.Revisions)
  assert.NotNil(t, rev)


  // EXAMPLE
  subject := &Subject{
  }
  var group Group
  assert.NoError(t, SendEndpointTest(AddGroup, nil, subject, set.A.Token, &group))
  PrintMsg(group)

  // create article

  // check content revision

  // check contact revisions
}
