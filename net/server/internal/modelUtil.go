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
    groups = append(groups, group.GroupSlot.GroupSlotId)
  }

  return &Card{
    CardId: slot.CardSlotId,
    Revision: slot.Revision,
    CardData: &CardData {
      NotifiedProfile: slot.Card.NotifiedProfile,
      NotifiedContent: slot.Card.NotifiedContent,
      NotifiedLabel: slot.Card.NotifiedLabel,
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

func getGroupModel(slot *store.GroupSlot) *Group {
  if slot.Group == nil {
    return &Group{
      GroupId: slot.GroupSlotId,
    }
  }

  return &Group{
    GroupId: slot.GroupSlotId,
    Revision: slot.Revision,
    GroupData: &GroupData {
      DataType: slot.Group.DataType,
      Data: slot.Group.GroupData.Data,
      Created: slot.Group.Created,
      Updated: slot.Group.Updated,
    },
  }
}

func getArticleModel(slot *store.ArticleSlot, contact bool, shared bool) *Article {

  if !shared || slot.Article == nil {
    return &Article{
      ArticleId: slot.ArticleSlotId,
      Revision: slot.Revision,
    }
  }

  var groups []string;
  if !contact {
    for _, group := range slot.Article.Groups {
      groups = append(groups, group.GroupSlot.GroupSlotId)
    }
  }

  var labels []string;
  for _, label := range slot.Article.Labels {
    labels = append(labels, label.LabelSlot.LabelSlotId)
  }

  return &Article{
    ArticleId: slot.ArticleSlotId,
    Revision: slot.Revision,
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

