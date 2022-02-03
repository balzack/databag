package databag

import (
  "databag/internal/store"
)

func getCardModel(slot *store.CardSlot) *Card {

  if slot.Card == nil {
    return &Card{
      CardId: slot.CardSlotId,
    }
  }

  // populate group id list
  var groups []string;
  for _, group := range slot.Card.Groups {
    groups = append(groups, group.GroupId)
  }

  return &Card{
    CardId: slot.CardSlotId,
      CardData: &CardData {
      NotifiedProfile: slot.Card.NotifiedProfile,
      NotifiedContent: slot.Card.NotifiedContent,
      NotifiedView: slot.Card.NotifiedView,
      CardProfile: &CardProfile{
        Guid: slot.Card.Guid,
        Handle: slot.Card.Username,
        Name: slot.Card.Name,
        Description: slot.Card.Description,
        Location: slot.Card.Location,
        Revision: slot.Card.ProfileRevision,
        ImageSet: slot.Card.Image != "",
        Version: slot.Card.Version,
        Node: slot.Card.Node,
      },
      Status: slot.Card.Status,
      Notes: slot.Card.Notes,
      Token: slot.Card.OutToken,
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
  }

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

