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

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

  // initial revision
  rev = GetTestRevision(set.A.Revisions)

  // create article
  articleAccess := &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, set.A.Token, &article))
  PrintMsg(article);

  // check revisions
  rev = GetTestRevision(set.A.Revisions)


  // view article

  PrintMsg(rev)
}
