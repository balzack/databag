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
  var article *Article
  var articles *[]Article
  var articleAccess *ArticleAccess
  var cards []Card
  var label *Label
  var subject *Subject
  var vars *map[string]string
  var contentRevision int64
  var viewRevision int64
  var labelRevision int64
  var labels *[]Label
  var view int64

  // setup testing group
  set, err = AddTestGroup("addarticle")
  assert.NoError(t, err)

  // initial revision
  rev = GetTestRevision(set.B.Revisions)

  // create article
  articleAccess = &ArticleAccess{ Groups: []string{set.A.B.GroupId} }
  article = &Article{}
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, article))

  article = &Article{}
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, article))

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
  view, err = strconv.ParseInt(resp.Header["View-Revision"][0], 10, 64)
  assert.NoError(t, err)
  assert.Equal(t, view, cards[0].CardData.NotifiedView)

  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles?contentRevision=0&viewRevision=" + strconv.FormatInt(cards[0].CardData.NotifiedView, 10), nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles))
  assert.Equal(t, 2, len(*articles))

  ver = GetTestRevision(set.C.Revisions)

  // add another article
  article = &Article{}
  articleAccess = &ArticleAccess{}
  assert.NoError(t, SendEndpointTest(AddArticle, "POST", "/content/articles", nil, articleAccess, APP_TOKENAPP, set.A.Token, article))

  // capture updated card on new article
  rev = GetTestRevision(set.C.Revisions)
  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(ver.Card, 10), nil, nil, APP_TOKENAPP, set.C.Token, &cards))
  assert.Equal(t, 1, len(cards))
  viewRevision = cards[0].CardData.NotifiedView
  contentRevision = cards[0].CardData.NotifiedContent
  labelRevision = cards[0].CardData.NotifiedLabel
  ver = rev

  // create new label
  label = &Label{}
  subject = &Subject{ DataType: "labeltype", Data: "labeldata" }
  assert.NoError(t, SendEndpointTest(AddLabel, "POST", "/content/labels", nil, subject, APP_TOKENAPP, set.A.Token, label))
  vars = &map[string]string{
    "labelId": label.LabelId,
    "groupId": set.A.C.GroupId,
  }
  label = &Label{}
  assert.NoError(t, SendEndpointTest(SetLabelGroup, "POST", "/content/labels/{labelId}/groups/{groupId}", vars, nil, APP_TOKENAPP, set.A.Token, label))

  // capture updated card on new assigned label
  rev = GetTestRevision(set.C.Revisions)
  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(ver.Card, 10), nil, nil, APP_TOKENAPP, set.C.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.NotEqual(t, viewRevision, cards[0].CardData.NotifiedView)
  assert.NotEqual(t, labelRevision, cards[0].CardData.NotifiedLabel)
  viewRevision = cards[0].CardData.NotifiedView
  contentRevision = cards[0].CardData.NotifiedContent
  labelRevision = cards[0].CardData.NotifiedLabel
  ver = rev

  // assign label to article
  vars = &map[string]string{
    "labelId": label.LabelId,
    "articleId": article.ArticleId,
  }
  article = &Article{}
  assert.NoError(t, SendEndpointTest(SetArticleLabel, "POST", "/content/articles/{articleId}/labels/{labelId}", vars, nil, APP_TOKENAPP, set.A.Token, article))

  // capture updated card on assigned article
  rev = GetTestRevision(set.C.Revisions)
  assert.NoError(t, SendEndpointTest(GetCards, "GET", "/contact/cards?cardRevision=" + strconv.FormatInt(ver.Card, 10), nil, nil, APP_TOKENAPP, set.C.Token, &cards))
  assert.Equal(t, 1, len(cards))
  assert.NotEqual(t, contentRevision, cards[0].CardData.NotifiedContent)
  ver = rev

  // confirm c can see new article
  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.C.A.Token, articles))
  assert.Equal(t, 1, len(*articles))
  assert.Equal(t, (*articles)[0].ArticleId, article.ArticleId)
  assert.Equal(t, 1, len((*articles)[0].ArticleData.Labels))
  assert.Equal(t, (*articles)[0].ArticleData.Labels[0], label.LabelId)

  // confirm b cannot see new article
  articles = &[]Article{}
  assert.NoError(t, SendEndpointTest(GetArticles, "GET", "/content/articles", nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles))
  assert.Equal(t, 1, len(*articles))
  assert.NotEqual(t, article.ArticleId, (*articles)[0].ArticleId)

  labels = &[]Label{}
  assert.NoError(t, SendEndpointTest(GetLabels, "GET", "/content/labels", nil, nil, APP_TOKENAPP, set.A.Token, labels))
  assert.Equal(t, 1, len(*labels))

  labels = &[]Label{}
  assert.NoError(t, SendEndpointTest(GetLabels, "GET", "/content/labels", nil, nil, APP_TOKENCONTACT, set.B.A.Token, labels))
  assert.Equal(t, 0, len(*labels))

  labels = &[]Label{}
  assert.NoError(t, SendEndpointTest(GetLabels, "GET", "/content/labels", nil, nil, APP_TOKENCONTACT, set.C.A.Token, labels))
  assert.Equal(t, 1, len(*labels))

  r, w, ret = NewRequest("GET", "/content/labels", nil)
  assert.NoError(t, ret)
  r.Header.Add("TokenType", APP_TOKENCONTACT)
  SetBearerAuth(r, set.C.A.Token)
  GetLabels(w, r)
  resp = w.Result()
  view, err = strconv.ParseInt(resp.Header["View-Revision"][0], 10, 64)
  assert.NoError(t, err)
  assert.Equal(t, cards[0].CardData.NotifiedView, view)
}
