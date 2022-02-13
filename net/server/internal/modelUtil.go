package databag

import (
  "databag/internal/store"
)

func getProfileModel(account *store.Account) *Profile {

  return &Profile{
    Guid: account.Guid,
    Handle: account.Username,
    Description: account.AccountDetail.Description,
    Location: account.AccountDetail.Location,
    Image: account.AccountDetail.Image,
    Revision: account.ProfileRevision,
    Version: APP_VERSION,
    Node: "https://" + getStrConfigValue(CONFIG_DOMAIN, "") + "/",
  }
}

func getCardModel(slot *store.CardSlot) *Card {

  if slot.Card == nil {
    return &Card{
      Id: slot.CardSlotId,
      Revision: slot.Revision,
    }
  }

  return &Card{
    Id: slot.CardSlotId,
    Revision: slot.Revision,
    Data: &CardData {
      NotifiedProfile: slot.Card.NotifiedProfile,
      NotifiedArticle: slot.Card.NotifiedArticle,
      NotifiedChannel: slot.Card.NotifiedChannel,
      NotifiedView: slot.Card.NotifiedView,
      ProfileRevision: slot.Card.ProfileRevision,
      DetailRevision: slot.Card.DetailRevision,
      CardDetail: getCardDetailModel(slot),
      CardProfile: getCardProfileModel(slot),
    },
  }
}

func getCardRevisionModel(slot *store.CardSlot) *Card {

  if slot.Card == nil {
    return &Card{
      Id: slot.CardSlotId,
      Revision: slot.Revision,
    }
  }

  return &Card{
    Id: slot.CardSlotId,
    Revision: slot.Revision,
    Data: &CardData {
      NotifiedProfile: slot.Card.NotifiedProfile,
      NotifiedArticle: slot.Card.NotifiedArticle,
      NotifiedChannel: slot.Card.NotifiedChannel,
      NotifiedView: slot.Card.NotifiedView,
      ProfileRevision: slot.Card.ProfileRevision,
      DetailRevision: slot.Card.DetailRevision,
    },
  }
}

func getCardDetailModel(slot *store.CardSlot) *CardDetail {

  var groups []string;
  for _, group := range slot.Card.Groups {
    groups = append(groups, group.GroupSlot.GroupSlotId)
  }

  return &CardDetail{
    Status: slot.Card.Status,
    Token: slot.Card.OutToken,
    Notes: slot.Card.Notes,
    Groups: groups,
  }
}

func getCardProfileModel(slot *store.CardSlot) *CardProfile {

  return &CardProfile{
    Guid: slot.Card.Guid,
    Handle: slot.Card.Username,
    Name: slot.Card.Name,
    Description: slot.Card.Description,
    Location: slot.Card.Location,
    ImageSet: slot.Card.Image != "",
    Version: slot.Card.Version,
    Node: slot.Card.Node,
  }
}

func getGroupModel(slot *store.GroupSlot) *Group {
  if slot.Group == nil {
    return &Group{
      Id: slot.GroupSlotId,
      Revision: slot.Revision,
    }
  }

  return &Group{
    Id: slot.GroupSlotId,
    Revision: slot.Revision,
    Data: &GroupData {
      DataType: slot.Group.DataType,
      Data: slot.Group.GroupData.Data,
      Created: slot.Group.Created,
      Updated: slot.Group.Updated,
    },
  }
}

func getArticleModel(slot *store.ArticleSlot, showGroups bool) *Article {
  if slot.Article == nil {
    return &Article{
      Id: slot.ArticleSlotId,
      Revision: slot.Revision,
    }
  }

  var articleGroups *ArticleGroups
  if showGroups {
    var groups []string;
    for _, group := range slot.Article.Groups {
      groups = append(groups, group.GroupSlot.GroupSlotId)
    }
    articleGroups = &ArticleGroups{ Groups: groups }
  }

  return &Article{
    Id: slot.ArticleSlotId,
    Revision: slot.Revision,
    Data: &ArticleData {
      DataType: slot.Article.DataType,
      Data: slot.Article.Data,
      Created: slot.Article.Created,
      Updated: slot.Article.Updated,
      Groups: articleGroups,
    },
  }
}


