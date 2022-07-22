package databag

import (
	"databag/internal/store"
)

func getProfileModel(account *store.Account) *Profile {

	return &Profile{
		GUID:        account.GUID,
		Handle:      account.Username,
		Name:        account.AccountDetail.Name,
		Description: account.AccountDetail.Description,
		Location:    account.AccountDetail.Location,
		Image:       account.AccountDetail.Image,
		Revision:    account.ProfileRevision,
		Version:     APPVersion,
		Node:        getStrConfigValue(CNFDomain, ""),
	}
}

func getCardModel(slot *store.CardSlot) *Card {

	if slot.Card == nil {
		return &Card{
			ID:       slot.CardSlotID,
			Revision: slot.Revision,
		}
	}

	return &Card{
		ID:       slot.CardSlotID,
		Revision: slot.Revision,
		Data: &CardData{
			NotifiedProfile: slot.Card.NotifiedProfile,
			NotifiedArticle: slot.Card.NotifiedArticle,
			NotifiedChannel: slot.Card.NotifiedChannel,
			NotifiedView:    slot.Card.NotifiedView,
			ProfileRevision: slot.Card.ProfileRevision,
			DetailRevision:  slot.Card.DetailRevision,
			CardDetail:      getCardDetailModel(slot),
			CardProfile:     getCardProfileModel(slot),
		},
	}
}

func getCardRevisionModel(slot *store.CardSlot) *Card {

	if slot.Card == nil {
		return &Card{
			ID:       slot.CardSlotID,
			Revision: slot.Revision,
		}
	}

	return &Card{
		ID:       slot.CardSlotID,
		Revision: slot.Revision,
		Data: &CardData{
			NotifiedProfile: slot.Card.NotifiedProfile,
			NotifiedArticle: slot.Card.NotifiedArticle,
			NotifiedChannel: slot.Card.NotifiedChannel,
			NotifiedView:    slot.Card.NotifiedView,
			ProfileRevision: slot.Card.ProfileRevision,
			DetailRevision:  slot.Card.DetailRevision,
		},
	}
}

func getCardDetailModel(slot *store.CardSlot) *CardDetail {

	var groups []string
	for _, group := range slot.Card.Groups {
		groups = append(groups, group.GroupSlot.GroupSlotID)
	}

	return &CardDetail{
		Status: slot.Card.Status,
		Token:  slot.Card.OutToken,
		Notes:  slot.Card.Notes,
		Groups: groups,
	}
}

func getCardProfileModel(slot *store.CardSlot) *CardProfile {

	return &CardProfile{
		GUID:        slot.Card.GUID,
		Handle:      slot.Card.Username,
		Name:        slot.Card.Name,
		Description: slot.Card.Description,
		Location:    slot.Card.Location,
		ImageSet:    slot.Card.Image != "",
		Version:     slot.Card.Version,
		Node:        slot.Card.Node,
	}
}

func getGroupModel(slot *store.GroupSlot) *Group {
	if slot.Group == nil {
		return &Group{
			ID:       slot.GroupSlotID,
			Revision: slot.Revision,
		}
	}

	return &Group{
		ID:       slot.GroupSlotID,
		Revision: slot.Revision,
		Data: &GroupData{
			DataType: slot.Group.DataType,
			Data:     slot.Group.GroupData.Data,
			Created:  slot.Group.Created,
			Updated:  slot.Group.Updated,
		},
	}
}

func getArticleModel(slot *store.ArticleSlot, showData bool, showList bool) *Article {
	if !showData || slot.Article == nil {
		return &Article{
			ID:       slot.ArticleSlotID,
			Revision: slot.Revision,
		}
	}

	var articleGroups *IDList
	if showList {
		var groups []string
		for _, group := range slot.Article.Groups {
			groups = append(groups, group.GroupSlot.GroupSlotID)
		}
		articleGroups = &IDList{IDs: groups}
	}

	return &Article{
		ID:       slot.ArticleSlotID,
		Revision: slot.Revision,
		Data: &ArticleData{
			DataType: slot.Article.DataType,
			Data:     slot.Article.Data,
			Created:  slot.Article.Created,
			Updated:  slot.Article.Updated,
			Groups:   articleGroups,
		},
	}
}

func getChannelRevisionModel(slot *store.ChannelSlot, showData bool) *Channel {

	if !showData || slot.Channel == nil {
		return &Channel{
			ID:       slot.ChannelSlotID,
			Revision: slot.Revision,
		}
	}

	return &Channel{
		ID:       slot.ChannelSlotID,
		Revision: slot.Revision,
		Data: &ChannelData{
			DetailRevision: slot.Channel.DetailRevision,
			TopicRevision:  slot.Channel.TopicRevision,
		},
	}
}

func getChannelDetailModel(slot *store.ChannelSlot, showList bool) *ChannelDetail {

	if slot.Channel == nil {
		return nil
	}

	var contacts *ChannelContacts
	if showList {
		var groups []string
		for _, group := range slot.Channel.Groups {
			groups = append(groups, group.GroupSlot.GroupSlotID)
		}
		var cards []string
		for _, card := range slot.Channel.Cards {
			cards = append(cards, card.CardSlot.CardSlotID)
		}
		contacts = &ChannelContacts{Groups: groups, Cards: cards}
	}

	members := []string{}
	for _, card := range slot.Channel.Cards {
		members = append(members, card.GUID)
	}

	return &ChannelDetail{
		DataType: slot.Channel.DataType,
		Data:     slot.Channel.Data,
		Created:  slot.Channel.Created,
		Updated:  slot.Channel.Updated,
		Contacts: contacts,
		Members:  members,
	}
}

func getChannelSummaryModel(slot *store.ChannelSlot) *ChannelSummary {

	if slot.Channel == nil {
		return nil
	}

	topicDetail := TopicDetail{}
	if len(slot.Channel.Topics) > 0 {
		topicDetail.GUID = slot.Channel.Topics[0].GUID
		topicDetail.DataType = slot.Channel.Topics[0].DataType
		topicDetail.Data = slot.Channel.Topics[0].Data
		topicDetail.Created = slot.Channel.Topics[0].Created
		topicDetail.Updated = slot.Channel.Topics[0].Updated
		topicDetail.Status = slot.Channel.Topics[0].Status
	}

	return &ChannelSummary{
		LastTopic: &topicDetail,
	}
}

func getChannelModel(slot *store.ChannelSlot, showData bool, showList bool) *Channel {

	if !showData || slot.Channel == nil {
		return &Channel{
			ID:       slot.ChannelSlotID,
			Revision: slot.Revision,
		}
	}

	return &Channel{
		ID:       slot.ChannelSlotID,
		Revision: slot.Revision,
		Data: &ChannelData{
			DetailRevision: slot.Channel.DetailRevision,
			TopicRevision:  slot.Channel.TopicRevision,
			ChannelDetail:  getChannelDetailModel(slot, showList),
			ChannelSummary: getChannelSummaryModel(slot),
		},
	}
}

func getTopicRevisionModel(slot *store.TopicSlot) *Topic {

	if slot.Topic == nil {
		return &Topic{
			ID:       slot.TopicSlotID,
			Revision: slot.Revision,
		}
	}

	return &Topic{
		ID:       slot.TopicSlotID,
		Revision: slot.Revision,
		Data: &TopicData{
			DetailRevision: slot.Topic.DetailRevision,
			TagRevision:    slot.Topic.TagRevision,
		},
	}
}

func getTopicDetailModel(slot *store.TopicSlot) *TopicDetail {

	if slot.Topic == nil {
		return nil
	}

	transform := APPTransformComplete
	for _, asset := range slot.Topic.Assets {
		if asset.Status == APPAssetError {
			transform = APPTransformError
		} else if asset.Status == APPAssetWaiting && transform == APPTransformComplete {
			transform = APPTransformIncomplete
		}
	}

	return &TopicDetail{
		GUID:      slot.Topic.GUID,
		DataType:  slot.Topic.DataType,
		Data:      slot.Topic.Data,
		Created:   slot.Topic.Created,
		Updated:   slot.Topic.Updated,
		Status:    slot.Topic.Status,
		Transform: transform,
	}
}

func getTopicModel(slot *store.TopicSlot) *Topic {

	if slot.Topic == nil {
		return &Topic{
			ID:       slot.TopicSlotID,
			Revision: slot.Revision,
		}
	}

	return &Topic{
		ID:       slot.TopicSlotID,
		Revision: slot.Revision,
		Data: &TopicData{
			DetailRevision: slot.Topic.DetailRevision,
			TopicDetail:    getTopicDetailModel(slot),
			TagRevision:    slot.Topic.TagRevision,
		},
	}
}

func getTagModel(slot *store.TagSlot) *Tag {

	if slot.Tag == nil {
		return &Tag{
			ID:       slot.TagSlotID,
			Revision: slot.Revision,
		}
	}

	return &Tag{
		ID:       slot.TagSlotID,
		Revision: slot.Revision,
		Data: &TagData{
			GUID:     slot.Tag.GUID,
			DataType: slot.Tag.DataType,
			Data:     slot.Tag.Data,
			Created:  slot.Tag.Created,
			Updated:  slot.Tag.Updated,
		},
	}
}
