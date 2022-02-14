package databag

import (
  "errors"
  "net/http"
  "gorm.io/gorm"
  "github.com/gorilla/mux"
  "databag/internal/store"
)

func SetArticleSubject(w http.ResponseWriter, r *http.Request) {

  account, code, err := BearerAppToken(r, false);
  if err != nil {
    ErrResponse(w, code, err)
    return
  }

  // scan parameters
  params := mux.Vars(r)
  articleId := params["articleId"]

  var subject Subject
  if err := ParseRequest(r, w, &subject); err != nil {
    ErrResponse(w, http.StatusBadRequest, err)
    return
  }

  // load referenced article
  var slot store.ArticleSlot
  if err := store.DB.Preload("Article.Groups.Cards").Where("account_id = ? AND article_slot_id = ?", account.ID, articleId).First(&slot).Error; err != nil {
    if !errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusInternalServerError, err)
    } else {
      ErrResponse(w, http.StatusNotFound, err)
    }
    return
  }
  if slot.Article == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("article has been deleted"))
    return
  }

  // determine affected contact list
  cards := make(map[string]*store.Card)
  for _, group := range slot.Article.Groups {
    for _, card := range group.Cards {
      cards[card.Guid] = &card
    }
  }

  // save and update contact revision
  err = store.DB.Transaction(func(tx *gorm.DB) error {
    if res := tx.Model(&slot.Article).Update("data", subject.Data).Error; res != nil {
      return res
    }
    if res := tx.Model(&slot.Article).Update("data_type", subject.DataType).Error; res != nil {
      return res
    }
    if res := tx.Model(&slot).Update("revision", account.ArticleRevision + 1).Error; res != nil {
      return res
    }
    if res := tx.Model(&account).Update("article_revision", account.ArticleRevision + 1).Error; res != nil {
      return res
    }
    return nil
  })
  if err != nil {
    ErrResponse(w, http.StatusInternalServerError, err)
    return
  }

  // notify contacts of content change
  SetStatus(account)
  for _, card := range cards {
    SetContactArticleNotification(account, card)
  }

  WriteResponse(w, getArticleModel(&slot, true));
}

