package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestShareAttribute(t *testing.T) {
  var articles *[]Article
  var subject *Subject
  var article *Article

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


  PrintMsg(article)
  PrintMsg(articles)
}

