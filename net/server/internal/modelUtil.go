package databag

import (
  "databag/internal/store"
)

func getCardModel(card *store.Card) *Card {

  // populate group id list
  var groups []string;
  for _, group := range card.Groups {
    groups = append(groups, group.GroupId)
  }

  return &Card{
    CardId: card.CardId,
    NotifiedProfile: card.NotifiedProfile,
    NotifiedContent: card.NotifiedContent,
    NotifiedView: card.NotifiedView,
    CardProfile: &CardProfile{
      Guid: card.Guid,
      Handle: card.Username,
      Name: card.Name,
      Description: card.Description,
      Location: card.Location,
      Revision: card.ProfileRevision,
      ImageSet: card.Image != "",
      Version: card.Version,
      Node: card.Node,
    },
    CardData: &CardData {
      Revision: card.DataRevision,
      Status: card.Status,
      Notes: card.Notes,
      Token: card.OutToken,
      Groups: groups,
    },
  }
}

func getGroupModel(group *store.Group) *Group {
  return &Group{
    GroupId: group.GroupId,
    Revision: group.Revision,
    DataType: group.DataType,
    Data: group.GroupData.Data,
    Created: group.Created,
    Updated: group.Updated,
  }
}

func getArticleModel(slot *store.ArticleSlot, contact bool, shared bool) *Article {

  if !shared || slot.Article == nil {
    return &Article{
      ArticleId: slot.ArticleSlotId,
    }
  } else {

    var groups []string;
    if !contact {
      for _, group := range slot.Article.Groups {
        groups = append(groups, group.GroupId)
      }
    }

    var labels []string;
    for _, label := range slot.Article.Labels {
      labels = append(labels, label.LabelId)
    }

    return &Article{
      ArticleId: slot.ArticleSlotId,
      ArticleData: &ArticleData{
        DataType: slot.Article.DataType,
        Data: slot.Article.Data,
        Status: slot.Article.Status,
        Labels: labels,
        Groups: groups,
        TagCount: slot.Article.TagCount,
        Created: slot.Article.Created,
        Updated: slot.Article.Updated,
        TagUpdated: slot.Article.TagUpdated,
        TagRevision: slot.Article.TagRevision,
      },
    }
  }
}

