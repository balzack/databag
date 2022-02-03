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
  var articles *[]Article
  var articleAccess *ArticleAccess

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

PrintMsg(set)

  // initial revision
  rev = GetTestRevision(set.B.Revisions)

  // create article
  articleAccess = &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, &article))

  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, &article))

  assert.NoError(t, SendEndpointTest(RemoveArticle, "DELETE", "/content/articls/" + article.ArticleId, &map[string]string{"articleId": article.ArticleId }, nil, APP_TOKENAPP, set.A.Token, nil))

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENAPP, set.A.Token, articles))
  assert.Equal(t, 2, len(*articles))
  assert.True(t, (*articles)[0].ArticleData != nil || (*articles)[1].ArticleData != nil)
  assert.True(t, (*articles)[0].ArticleData == nil || (*articles)[1].ArticleData == nil)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles))
  assert.Equal(t, 2, len(*articles))
  assert.True(t, (*articles)[0].ArticleData != nil || (*articles)[1].ArticleData != nil)
  assert.True(t, (*articles)[0].ArticleData == nil || (*articles)[1].ArticleData == nil)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.C.A.Token, articles))
  assert.Equal(t, 2, len(*articles))
  assert.True(t, (*articles)[0].ArticleData == nil && (*articles)[1].ArticleData == nil)

  // view article
  assert.NotEqual(t, GetTestRevision(set.B.Revisions).Card, rev)

}
