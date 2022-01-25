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
    ProfileRevision: card.RemoteProfile,
    ContentRevision: card.RemoteContent,
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
    Data: group.Data,
    Created: group.Created,
    Updated: group.Updated,
  }
}
