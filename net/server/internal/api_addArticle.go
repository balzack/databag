package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/google/uuid"
  "databag/internal/store"
)

func AddArticle(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false)
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  var articleAccess ArticleAccess
  if err := ParseRequest(r, w, &articleAccess); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  var groups []store.Group
  if err := store.DB.Where("group_id IN ?", articleAccess.Groups).Find(&groups).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var labels []store.Label
  if err := store.DB.Where("label_id IN ?", articleAccess.Labels).Find(&labels).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var articleBlock store.ArticleBlock
  if err := store.DB.Preload("Articles").Where("account_id = ?", account.ID).Last(&articleBlock).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      if err := addArticleBlock(account, &articleBlock); err != nil {
        ErrResponse(w, http.StatusInternalServerError, err)
        return
      }
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  }
  if len(articleBlock.Articles) >= APP_ARTICLEBLOCKSIZE {
    if err := addArticleBlock(account, &articleBlock); err != nil {
      ErrResponse(w, http.StatusInternalServerError, err)
      return
    }
  }

  article := &store.Article{
    ArticleId: uuid.New().String(),
    ArticleBlockID: articleBlock.ID,
    AccountID: account.ID,
    Revision: 1,
    Status: APP_ARTICLEUNCONFIRMED,
    Expires: 0,
    TagUpdated: 0,
    TagRevision: 0,
    Groups: groups,
    Labels: labels,
  }
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Save(article).Error; res != nil {
      return res
    }
    if res := tx.Model(&articleBlock).Update("revision", account.ContentRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("content_revision", account.ContentRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  articleEntry := &ArticleEntry{
    BlockId: articleBlock.ArticleBlockId,
    Article: getArticleModel(article, 0),
  }

  SetStatus(account)
  SetContentNotification(account)
  WriteResponse(w, articleEntry)
}

func addArticleBlock(account *store.Account, articleBlock *store.ArticleBlock) (err error) {
  articleBlock.ArticleBlockId = uuid.New().String()
  articleBlock.AccountID = account.ID
  articleBlock.Revision = account.ContentRevision
  if err = store.DB.Save(articleBlock).Error; err != nil {
    return
  }
  return
}

