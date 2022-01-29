package databag

import (
  "strings"
  "strconv"
  "errors"
  "net/http"
  "gorm.io/gorm"
  "databag/internal/store"
)

func GetArticleBlocks(w http.ResponseWriter, r *http.Request) {
  var err error

  var contentRevision int64
  if contentRevision, err = getArticleBlockRevision(r.FormValue("contentRevision")); err != nil {
    ErrMsg(err)
  }

  // extract token
  tokenType := r.Header.Get("TokenType")
  auth := r.Header.Get("Authorization")
  token := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer"))
  target, access, err := ParseToken(token)
  if err != nil {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid bearer token"))
    return
  }

  // retrieve updated blocks
  var blocks []store.ArticleBlock
  if tokenType == APP_TOKENAPP {
    var app store.App
    if err := store.DB.Preload("Account").Where("account_id = ? AND token = ?", target, access).First(&app).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }

    // retrieve block ids
    if err = getAccountArticleBlocks(&app.Account, contentRevision, &blocks); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  } else if tokenType == APP_TOKENCONTACT {
    var card store.Card
    if err := store.DB.Preload("Account").Where("account_id = ? AND InToken = ?", target, access).First(&card).Error; err != nil {
      if errors.Is(err, gorm.ErrRecordNotFound) {
        ErrResponse(w, http.StatusNotFound, err)
      } else {
        ErrResponse(w, http.StatusInternalServerError, err)
      }
      return
    }

    var viewRevision int64
    if viewRevision, err = getArticleBlockRevision(r.FormValue("viewRevision")); err != nil {
      ErrMsg(err)
    }

    // retrieve block ids
    if err = getCardArticleBlocks(&card, viewRevision, contentRevision, &blocks); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("invalid token type"))
  }

  var ids []string
  for _, block := range blocks {
    ids = append(ids, block.ArticleBlockId)
  }
  WriteResponse(w, ids)
}

func getArticleBlockRevision(param string) (rev int64, err error) {
  if param == "" {
    return
  }
  rev, err = strconv.ParseInt(param, 10, 64)
  return
}

func getAccountArticleBlocks(act *store.Account, content int64, blocks *[]store.ArticleBlock) error {
  return store.DB.Where("revision > ? AND account_id = ?", content, act.ID).Find(blocks).Error
}

func getCardArticleBlocks(card *store.Card, view int64, content int64, blocks *[]store.ArticleBlock) error {
  if view != card.ViewRevision + card.Account.ViewRevision {
    return store.DB.Where("revision > ? && account_id = ?", content, card.Account.ID).Find(blocks).Error
  } else {
    return store.DB.Where("account_id = ?", card.Account.ID).Find(blocks).Error
  }
}




