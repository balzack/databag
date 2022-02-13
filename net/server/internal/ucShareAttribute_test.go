package databag

import (
  "testing"
  "github.com/stretchr/testify/assert"
)

func TestShareAttribute(t *testing.T) {
  var articles []Article

  // setup testing group
  set, err := AddTestGroup("shareattribute")
  assert.NoError(t, err)

  assert.NoError(t, ApiTestMsg(GetArticles, "GET", "/attribute/articles",
    nil, nil, APP_TOKENAPP, set.A.Token, &articles, nil))

  PrintMsg(articles)
}

