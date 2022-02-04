package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

func TestAddArticle(t *testing.T) {
  var set *TestGroup
  var err error
  var rev *Revision
  var ver *Revision
  var article Article
  var articles *[]Article
  var articleAccess *ArticleAccess
  var cards []Card

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

  // initial revision
  rev = GetTestRevision(set.B.Revisions)

  // create article
  articleAccess = &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, &article))

  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, &article))

  assert.NoError(t, SendEndpointTest(RemoveArticle, "DELETE", "/content/articls/" + article.ArticleId, &map[string]string{"articleId": article.ArticleId }, nil, APP_TOKENAPP, set.A.Token, nil))

  ver = GetTestRevision(set.B.Revisions)
  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(rev.Card, 10), nil, nil, APP_TOKENAPP, set.B.Token, &cards))
  assert.NotEqual(t, ver.Card, rev.Card)
  assert.Equal(t, 1, len(cards))
  rev = ver

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENAPP, set.A.Token, articles))
  assert.Equal(t, 2, len(*articles))
  assert.True(t, (*articles)[0].ArticleData != nil || (*articles)[1].ArticleData != nil)
  assert.True(t, (*articles)[0].ArticleData == nil || (*articles)[1].ArticleData == nil)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles))
  assert.Equal(t, 1, len(*articles))
  assert.True(t, (*articles)[0].ArticleData != nil)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.C.A.Token, articles))
  assert.Equal(t, 0, len(*articles))

  r, w, ret := NewRequest("GET", "/content/articles", nil)
  assert.NoError(t, ret)
  r.Header.Add("TokenType", APP_TOKENCONTACT)
  SetBearerAuth(r, set.B.A.Token)
  GetArticles(w, r)
  resp := w.Result()
  var view int64
  view, err = strconv.ParseInt(resp.Header["View-Revision"][0], 10, 64)
  assert.NoError(t, err)
  assert.Equal(t, view, cards[0].CardData.NotifiedView)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles?contentRevision=0&viewRevision=" + strconv.FormatInt(cards[0].CardData.NotifiedView, 10), nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles))
  assert.Equal(t, 2, len(*articles))

}
