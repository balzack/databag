package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {
  var set *TestGroup
  var err error
  var rev *Revision
  var article Article
  var contentRevision int64

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

  // initial revision
  rev = GetTestRevision(set.A.Revisions)
  contentRevision = rev.Content

  // create article
  articleAccess := &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  assert.NoError(t, SendEndpointTest(AddArticle, nil, articleAccess, set.A.Token, &article))

  // check revisions
  rev = GetTestRevision(set.A.Revisions)
  assert.Greater(t, rev.Content, contentRevision)

  // view article

  PrintMsg(rev)
}
