package databag

import (
  "errors"
  "strings"
  "net/http"
  "gorm.io/gorm"
  "encoding/base64"
  "github.com/gorilla/mux"
  "databag/internal/store"
  "github.com/valyala/fastjson"
)

func GetArticleSubjectField(w http.ResponseWriter, r *http.Request) {

  // scan parameters
  params := mux.Vars(r)
  articleId := params["articleId"]
  field := params["field"]
  elements := strings.Split(field, ".")

  var act *store.Account
  tokenType := r.Header.Get("TokenType")
  if tokenType == APP_TOKENAPP {
    account, code, err := BearerAppToken(r, false);
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = account
  } else if tokenType == APP_TOKENCONTACT {
    card, code, err := BearerContactToken(r, true)
    if err != nil {
      ErrResponse(w, code, err)
      return
    }
    act = &card.Account
  } else {
    ErrResponse(w, http.StatusBadRequest, errors.New("unknown token type"))
    return
  }

  // load article
  var slot store.ArticleSlot
  if err := store.DB.Preload("Article").Where("account_id = ? AND article_slot_id = ?", act.ID, articleId).First(&slot).Error; err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      ErrResponse(w, http.StatusNotFound, err)
    } else {
      ErrResponse(w, http.StatusInternalServerError, err)
    }
    return
  }
  if slot.Article == nil {
    ErrResponse(w, http.StatusNotFound, errors.New("referenced article missing"))
    return
  }

  // decode data
  strData := fastjson.GetString([]byte(slot.Article.Data), elements...)
  binData, err := base64.StdEncoding.DecodeString(strData)
  if err != nil {
    ErrResponse(w, http.StatusNotFound, err)
    return
  }

  w.Header().Set("Content-Type", http.DetectContentType(binData))
  w.Write(binData)
}

