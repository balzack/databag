package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestShareAttribute(t *testing.T) {
  var articles *[]Article
  var subject *Subject
  var article *Article
  param := map[string]string{}

  // setup testing group
  set, err := AddTestGroup("shareattribute")
  assert.NoError(t, err)

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

  // share article with B
  param["articleId"] = article.Id
  param["groupId"] = set.A.B.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleGroup, "PUT", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // TODO validate B & C view

  // update attribute
  data := "{ \"nested\" : { \"image\" : \"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\" } }"
  subject = &Subject{ Data: data, DataType: "nestedimage" }
  param["articleId"] = article.Id
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleSubject, "PUT", "/attribute/articles/{articleId}/subject",
    &param, subject, APP_TOKENAPP, set.A.Token, article, nil))

  // TODO validate B & C view

  // share article with C
  param["articleId"] = article.Id
  param["groupId"] = set.A.C.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(SetArticleGroup, "PUT", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // TODO C retrieve image

  // TODO validate B & C view

  // unshare article with B
  param["articleId"] = article.Id
  param["groupId"] = set.A.B.GroupId
  article = &Article{}
  assert.NoError(t, ApiTestMsg(ClearArticleGroup, "DELETE", "/attribute/articles/{articleId}/groups/{groupId}",
    &param, nil, APP_TOKENAPP, set.A.Token, article, nil))

  // TODO validate B & C view

  // delete article
  param["articleId"] = article.Id
  assert.NoError(t, ApiTestMsg(RemoveArticle, "DELETE", "/attribute/articles/{articleId}",
    &param, nil, APP_TOKENAPP, set.A.Token, nil, nil))
  articles = &[]Article{}
  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENAPP, set.A.Token, articles, nil))
  assert.Equal(t, 0, len(*articles))

  // TODO validate B & C view
}

