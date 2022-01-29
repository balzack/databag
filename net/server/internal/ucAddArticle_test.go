package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {
  var set *TestGroup
  var err error
  var rev *Revision
  var articleEntry ArticleEntry
  var contentRevision int64
  var ids []string

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

  // initial revision
  rev = GetTestRevision(set.A.Revisions)
  contentRevision = rev.Content

  // create article
  articleAccess := &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, set.A.Token, &articleEntry))
  PrintMsg(articleEntry);

  // check revisions
  rev = GetTestRevision(set.A.Revisions)
  assert.Greater(t, rev.Content, contentRevision)

  // view article blocks
  assert.NoError(t, SendEndpointTest(GetArticleBlocks, "GET", "/content/articleBlocks", nil, nil, set.A.Token, &ids))
  PrintMsg(ids)

  // view article

  PrintMsg(rev)
}
