package databag

import (
  "testing"
  "strconv"
  "github.com/stretchr/testify/assert"
)

func TestShareAttribute(t *testing.T) {
  var articles *[]Article
  var subject *Subject
  var article *Article
  param := map[string]string{}
  var bRev *Revision
  var cRev *Revision
  var rev *Revision
  var cards *[]Card
  var card *Card
  var revision string
  var rView string
  var rArticle string
  var bViewRevision int64
  var cViewRevision int64
  var bArticleRevision int64
  var cArticleRevision int64

  // setup testing group
  set, err := AddTestGroup("shareattribute")
  assert.NoError(t, err)

  // get latest
  card = &Card{}
  param["cardId"] = set.B.A.CardId
  bRev = GetTestRevision(set.B.Revisions)
  assert.NoError(t, ApiTestMsg(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil, APP_TOKENAPP, set.B.Token, card, nil))
  bViewRevision = card.Data.NotifiedView
  bArticleRevision = card.Data.NotifiedArticle
  card = &Card{}
  param["cardId"] = set.C.A.CardId
  cRev = GetTestRevision(set.C.Revisions)
  assert.NoError(t, ApiTestMsg(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil, APP_TOKENAPP, set.C.Token, card, nil))
  bViewRevision = card.Data.NotifiedView
  bArticleRevision = card.Data.NotifiedArticle

  // add a new attribute
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENAPP, set.A.Token, articles, nil))
  assert.Equal(t, 0, len(*articles))
  article = &Article{}
  subject = &Subject{ Data: "subjectdata", DataType: "subjectdatatype" }
  assert.NoError(t, ApiTestMsg(AddArticle, "POST", "/attributes/articles",
    nil, subject, APP_TOKENAPP, set.A.Token, article, nil))
  assert.Equal(t, "subjectdata", article.Data.Data)
  assert.Equal(t, "subjectdatatype", article.Data.DataType)
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENAPP, set.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))

  // should not have generated a revision
  assert.Nil(t, GetTestRevision(set.B.Revisions))
  assert.Nil(t, GetTestRevision(set.C.Revisions))

  // share article with B
  param["articleId"] = article.Id
  param["groupId"] = set.A.B.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleGroup, "PUT", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // validate B & C view
  cards = &[]Card{}
  rev = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, bRev.Card, rev.Card)
  assert.Nil(t, GetTestRevision(set.C.Revisions))
  revision = strconv.FormatInt(bRev.Card, 10)
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + revision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, nil))
  assert.Equal(t, 1, len(*cards))
  assert.NotEqual(t, bArticleRevision, (*cards)[0].Data.NotifiedArticle)
  assert.Equal(t, bViewRevision, (*cards)[0].Data.NotifiedView)
  bRev = rev
  bArticleRevision = (*cards)[0].Data.NotifiedArticle
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))
  assert.NotNil(t, (*articles)[0].Data)
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENCONTACT, set.C.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))
  assert.Nil(t, (*articles)[0].Data)

  // update attribute
  data := "{ \"nested\" : { \"image\" : \"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\" } }"
  subject = &Subject{ Data: data, DataType: "nestedimage" }
  param["articleId"] = article.Id
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleSubject, "PUT", "/attribute/articles/{articleId}/subject",
    &param, subject, APP_TOKENAPP, set.A.Token, article, nil))

  // validate B & C view
  cards = &[]Card{}
  rev = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, bRev.Card, rev.Card)
  assert.Nil(t, GetTestRevision(set.C.Revisions))
  revision = strconv.FormatInt(bRev.Card, 10)
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + revision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, nil))
  assert.Equal(t, 1, len(*cards))
  assert.NotEqual(t, bArticleRevision, (*cards)[0].Data.NotifiedArticle)
  assert.Equal(t, bViewRevision, (*cards)[0].Data.NotifiedView)
  bRev = rev
  rView = strconv.FormatInt(bViewRevision, 10)
  rArticle = strconv.FormatInt(bArticleRevision, 10)
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles?viewRevision=" + rView + "&articleRevision=" + rArticle,
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))
  assert.Equal(t, "nestedimage", (*articles)[0].Data.DataType)
  bArticleRevision = (*cards)[0].Data.NotifiedArticle
  bViewRevision = (*cards)[0].Data.NotifiedView

  // share article with C
  param["articleId"] = article.Id
  param["groupId"] = set.A.C.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleGroup, "PUT", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // TODO A retrieve image
  // TODO C retrieve image

  // validate B & C view
  cards = &[]Card{}
  rev = GetTestRevision(set.C.Revisions)
  assert.NotEqual(t, cRev.Card, rev.Card)
  assert.Nil(t, GetTestRevision(set.B.Revisions))
  revision = strconv.FormatInt(cRev.Card, 10)
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + revision,
    nil, nil, APP_TOKENAPP, set.C.Token, cards, nil))
  assert.Equal(t, 1, len(*cards))
  cRev = rev

  // unshare article with B
  param["articleId"] = article.Id
  param["groupId"] = set.A.B.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(ClearArticleGroup, "DELETE", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // validate B & C view
  cards = &[]Card{}
  rev = GetTestRevision(set.B.Revisions)
  assert.NotEqual(t, bRev.Card, rev.Card)
  assert.Nil(t, GetTestRevision(set.C.Revisions))
  revision = strconv.FormatInt(bRev.Card, 10)
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + revision,
    nil, nil, APP_TOKENAPP, set.B.Token, cards, nil))
  assert.Equal(t, 1, len(*cards))
  assert.NotEqual(t, bArticleRevision, (*cards)[0].Data.NotifiedArticle)
  assert.Equal(t, bViewRevision, (*cards)[0].Data.NotifiedView)
  bRev = rev
  rView = strconv.FormatInt(bViewRevision, 10)
  rArticle = strconv.FormatInt(bArticleRevision, 10)
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles?viewRevision=" + rView + "&articleRevision=" + rArticle,
    nil, nil, APP_TOKENCONTACT, set.B.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))
  assert.Nil(t, (*articles)[0].Data)
  card = &Card{}
  param["cardId"] = set.C.A.CardId
  GetTestRevision(set.B.Revisions)
  assert.NoError(t, ApiTestMsg(GetCard, "GET", "/contact/cards/{cardId}",
    &param, nil, APP_TOKENCONTACT, set.C.Token, card, nil))
  cArticleRevision = card.Data.NotifiedArticle
  cViewRevision = card.Data.NotifiedView

  // delete article
  param["articleId"] = article.Id
  assert.NoError(t, ApiTestMsg(RemoveArticle, "DELETE", "/attribute/articles/{articleId}",
    &param, nil, APP_TOKENAPP, set.A.Token, nil, nil))
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENAPP, set.A.Token, articles, nil))
  assert.Equal(t, 0, len(*articles))

  // validate B & C view
  cards = &[]Card{}
  rev = GetTestRevision(set.C.Revisions)
  assert.NotEqual(t, cRev.Card, rev.Card)
  assert.Nil(t, GetTestRevision(set.B.Revisions))
  revision = strconv.FormatInt(cRev.Card, 10)
  assert.NoError(t, ApiTestMsg(GetCards, "GET", "/contact/cards?revision=" + revision,
    nil, nil, APP_TOKENAPP, set.C.Token, cards, nil))
  assert.Equal(t, 1, len(*cards))
  rView = strconv.FormatInt(cViewRevision, 10)
  rArticle = strconv.FormatInt(cArticleRevision, 10)
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles?viewRevision=" + rView + "&articleRevision=" + rArticle,
    nil, nil, APP_TOKENCONTACT, set.C.A.Token, articles, nil))
  assert.Equal(t, 1, len(*articles))
  assert.Nil(t, (*articles)[0].Data)
}

