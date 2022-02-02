package databag

import (
  "time"
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

  var groups []store.Label
  if err := store.DB.Raw("select labels.* from labels inner join label_groups on labels.id = label_groups.label_id inner join groups on label_groups.group_id = groups.id where groups.group_id in ?", articleAccess.Groups).Scan(&groups).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  var labels []store.Label
  if err := store.DB.Where("label_id IN ?", articleAccess.Labels).Find(&labels).Error; err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }


  // save data and apply transaction
  var article *store.Article
  err = store.DB.Transaction(func(tx *gorm.DB) error {

    articleData := &store.ArticleData{
      DataRevision: 1,
      Status: APP_ARTICLEUNCONFIRMED,
      TagUpdated: time.Now().Unix(),
      TagRevision: 1,
      TagCount: 0,
      Labels: append(groups, labels...),
    };
    if res := store.DB.Save(articleData).Error; res != nil {
      return res;
    }

    if res := store.DB.Where("article_data_id = 0 AND account_id = ?", account.ID).First(&article).Error; res != nil {
      if errors.Is(res, gorm.ErrRecordNotFound) {
        article = &store.Article{
          ArticleId: uuid.New().String(),
          AccountID: account.ID,
          Revision: 1,
          ArticleDataID: articleData.ID,
          ArticleData: articleData,
        }
        if ret := store.DB.Save(article).Error; ret != nil {
          return ret;
        }
      } else {
        return res
      }
    }
    if ret := store.DB.Model(article).Update("article_data_id", articleData.ID).Error; ret != nil {
      return ret;
    }
    if ret := store.DB.Preload("ArticleData.Labels.Groups").Where("id = ?", article.ID).First(article).Error; ret != nil {
      return ret;
    }
    if ret := tx.Model(&account).Update("content_revision", account.ContentRevision + 1).Error; ret != nil {
      return ret
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  SetContentNotification(account)
  SetStatus(account)
  WriteResponse(w, getArticleModel(article, false, true))
}


