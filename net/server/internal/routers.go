package databag

import (
	"github.com/gorilla/mux"
	"net/http"
	"strings"
)

type route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type routes []route

//NewRouter allocate router for databag API
func NewRouter() *mux.Router {

	go SendNotifications()

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range endpoints {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}

	fs := http.FileServer(http.Dir("/app/databag/net/web/build/"))
	router.PathPrefix("/").Handler(http.StripPrefix("/", fs))

	return router
}

var endpoints = routes{

	route{
		"AddAccount",
		strings.ToUpper("Post"),
		"/account/profile",
		AddAccount,
	},

	route{
		"AddAccountApp",
		strings.ToUpper("Post"),
		"/account/apps",
		AddAccountApp,
	},

	route{
		"AddAccountAuthentication",
		strings.ToUpper("Post"),
		"/account/auth",
		AddAccountAuthentication,
	},

	route{
		"GetAccountApps",
		strings.ToUpper("Get"),
		"/account/apps",
		GetAccountApps,
	},

	route{
		"GetAccountAsset",
		strings.ToUpper("Get"),
		"/account/assets/{assetID}",
		GetAccountAsset,
	},

	route{
		"GetAccountListing",
		strings.ToUpper("Get"),
		"/account/listing",
		GetAccountListing,
	},

	route{
		"GetAccountListingImage",
		strings.ToUpper("Get"),
		"/account/listing/{guid}/image",
		GetAccountListingImage,
	},

	route{
		"GetAccountListingMessage",
		strings.ToUpper("Get"),
		"/account/listing/{guid}/message",
		GetAccountListingMessage,
	},

	route{
		"GetAccountStatus",
		strings.ToUpper("Get"),
		"/account/status",
		GetAccountStatus,
	},

	route{
		"GetAccountToken",
		strings.ToUpper("Get"),
		"/account/token",
		GetAccountToken,
	},

	route{
		"GetAccountAvailable",
		strings.ToUpper("Get"),
		"/account/available",
		GetAccountAvailable,
	},

	route{
		"GetAccountUsername",
		strings.ToUpper("Get"),
		"/account/username",
		GetAccountUsername,
	},

	route{
		"RemoveAccount",
		strings.ToUpper("Delete"),
		"/account/profile",
		RemoveAccount,
	},

	route{
		"RemoveAccountApp",
		strings.ToUpper("Delete"),
		"/account/apps/{appID}",
		RemoveAccountApp,
	},

  route{
    "RemoveAgentToken",
    strings.ToUpper("Delete"),
    "/account/apps",
    RemoveAgentToken,
  },

	route{
		"SetAccountAccess",
		strings.ToUpper("Put"),
		"/account/access",
		SetAccountAccess,
	},

	route{
		"SetAccountAuthentication",
		strings.ToUpper("Put"),
		"/account/auth",
		SetAccountAuthentication,
	},

	route{
		"SetAccountExport",
		strings.ToUpper("Put"),
		"/account/export",
		SetAccountExport,
	},

	route{
		"SetAccountNode",
		strings.ToUpper("Put"),
		"/account/node",
		SetAccountNode,
	},

	route{
		"SetAccountLogin",
		strings.ToUpper("Put"),
		"/account/login",
		SetAccountLogin,
	},

	route{
		"SetAccountNotification",
		strings.ToUpper("Put"),
		"/account/notification",
		SetAccountNotification,
	},

	route{
		"SetAccountSerchable",
		strings.ToUpper("Put"),
		"/account/searchable",
		SetAccountSearchable,
	},

	route{
		"AddNodeAccount",
		strings.ToUpper("Post"),
		"/admin/accounts",
		AddNodeAccount,
	},

	route{
		"GetNodeAccountImage",
		strings.ToUpper("Get"),
		"/admin/accounts/{accountID}/image",
		GetNodeAccountImage,
	},

	route{
		"SetNodeAccountStatus",
		strings.ToUpper("Put"),
		"/admin/accounts/{accountID}/status",
		SetNodeAccountStatus,
	},

	route{
		"AddNodeAccountAccess",
		strings.ToUpper("Post"),
		"/admin/accounts/{accountID}/auth",
		AddNodeAccountAccess,
	},

	route{
		"GetNodeAccounts",
		strings.ToUpper("Get"),
		"/admin/accounts",
		GetNodeAccounts,
	},

	route{
		"GetNodeConfig",
		strings.ToUpper("Get"),
		"/admin/config",
		GetNodeConfig,
	},

	route{
		"GetNodeStatus",
		strings.ToUpper("Get"),
		"/admin/status",
		GetNodeStatus,
	},

	route{
		"ImportAccount",
		strings.ToUpper("Post"),
		"/admin/accounts/import",
		ImportAccount,
	},

	route{
		"RemoveNodeAccount",
		strings.ToUpper("Delete"),
		"/admin/accounts/{accountID}",
		RemoveNodeAccount,
	},

	route{
		"SetNodeAccount",
		strings.ToUpper("Put"),
		"/admin/accounts/{accountID}/reset",
		SetNodeAccount,
	},

	route{
		"SetNodeConfig",
		strings.ToUpper("Put"),
		"/admin/config",
		SetNodeConfig,
	},

	route{
		"SetNodeStatus",
		strings.ToUpper("Put"),
		"/admin/status",
		SetNodeStatus,
	},

  route{
    "AddFlag",
    strings.ToUpper("Post"),
    "/account/flag/{guid}",
    AddFlag,
  },

	route{
		"AddGroup",
		strings.ToUpper("Post"),
		"/alias/groups",
		AddGroup,
	},

	route{
		"GetGroupSubjectField",
		strings.ToUpper("Get"),
		"/alias/groups/{groupID}/subject/{field}",
		GetGroupSubjectField,
	},

	route{
		"GetGroups",
		strings.ToUpper("Get"),
		"/alias/groups",
		GetGroups,
	},

	route{
		"RemoveGroup",
		strings.ToUpper("Delete"),
		"/alias/groups/{groupID}",
		RemoveGroup,
	},

	route{
		"SetGroupSubject",
		strings.ToUpper("Put"),
		"/alias/groups/{groupID}/subject",
		SetGroupSubject,
	},

	route{
		"AddArticle",
		strings.ToUpper("Post"),
		"/attribute/articles",
		AddArticle,
	},

	route{
		"ClearArticleGroup",
		strings.ToUpper("Delete"),
		"/attribute/articles/{articleID}/groups/{groupID}",
		ClearArticleGroup,
	},

	route{
		"GetArticleSubjectField",
		strings.ToUpper("Get"),
		"/attribute/articles/{articleID}/subject/{field}",
		GetArticleSubjectField,
	},

	route{
		"GetArticles",
		strings.ToUpper("Get"),
		"/attribute/articles",
		GetArticles,
	},

	route{
		"RemoveArticle",
		strings.ToUpper("Delete"),
		"/attribute/articles/{articleID}",
		RemoveArticle,
	},

	route{
		"SetArticleGroup",
		strings.ToUpper("Put"),
		"/attribute/articles/{articleID}/groups/{groupID}",
		SetArticleGroup,
	},

	route{
		"SetArticleSubject",
		strings.ToUpper("Put"),
		"/attribute/articles/{articleID}/subject",
		SetArticleSubject,
	},

	route{
		"Authorize",
		strings.ToUpper("Put"),
		"/authorize",
		Authorize,
	},

	route{
		"AddCard",
		strings.ToUpper("Post"),
		"/contact/cards",
		AddCard,
	},

	route{
		"ClearCardGroup",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}/groups/{groupID}",
		ClearCardGroup,
	},

	route{
		"ClearCardNotes",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}/notes",
		ClearCardNotes,
	},

	route{
		"GetCard",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}",
		GetCard,
	},

	route{
		"GetCardDetail",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/detail",
		GetCardDetail,
	},

	route{
		"GetCardProfile",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/profile",
		GetCardProfile,
	},

	route{
		"GetCardProfileImage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/profile/image",
		GetCardProfileImage,
	},

	route{
		"GetCards",
		strings.ToUpper("Get"),
		"/contact/cards",
		GetCards,
	},

	route{
		"GetCloseMessage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/closeMessage",
		GetCloseMessage,
	},

	route{
		"GetOpenMessage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/openMessage",
		GetOpenMessage,
	},

	route{
		"RemoveCard",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}",
		RemoveCard,
	},

	route{
		"SetArticleRevision",
		strings.ToUpper("Put"),
		"/contact/article/revision",
		SetArticleRevision,
	},

	route{
		"SetCardGroup",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/groups/{groupID}",
		SetCardGroup,
	},

	route{
		"SetCardNotes",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/notes",
		SetCardNotes,
	},

	route{
		"SetCardProfile",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/profile",
		SetCardProfile,
	},

	route{
		"SetCardStatus",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/status",
		SetCardStatus,
	},

	route{
		"SetChannelRevision",
		strings.ToUpper("Put"),
		"/contact/channel/revision",
		SetChannelRevision,
	},

	route{
		"SetCloseMessage",
		strings.ToUpper("Put"),
		"/contact/closeMessage",
		SetCloseMessage,
	},

	route{
		"SetOpenMessage",
		strings.ToUpper("Put"),
		"/contact/openMessage",
		SetOpenMessage,
	},

	route{
		"SetProfileRevision",
		strings.ToUpper("Put"),
		"/contact/profile/revision",
		SetProfileRevision,
	},

	route{
		"SetViewRevision",
		strings.ToUpper("Put"),
		"/contact/view/revision",
		SetViewRevision,
	},

	route{
		"SetPushEvent",
		strings.ToUpper("Post"),
		"/contact/notification",
		SetPushEvent,
	},

	route{
		"AddChannel",
		strings.ToUpper("Post"),
		"/content/channels",
		AddChannel,
	},

	route{
		"AddChannelTopicAsset",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics/{topicID}/assets",
		AddChannelTopicAsset,
	},

	route{
		"AddChannelTopic",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics",
		AddChannelTopic,
	},

	route{
		"AddChannelTopicTag",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics/{topicID}/tags",
		AddChannelTopicTag,
	},

	route{
		"ClearChannelCard",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/cards/{cardID}",
		ClearChannelCard,
	},

	route{
		"ClearChannelGroup",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/groups/{groupID}",
		ClearChannelGroup,
	},

	route{
		"GetChannelTopicAsset",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/assets/{assetID}",
		GetChannelTopicAsset,
	},

	route{
		"GetChannelTopicAssets",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/assets",
		GetChannelTopicAssets,
	},

	route{
		"GetChannelDetail",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/detail",
		GetChannelDetail,
	},

	route{
		"GetChannelSummary",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/summary",
		GetChannelSummary,
	},

	route{
		"GetChannelSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/subject/{field}",
		GetChannelSubjectField,
	},

	route{
		"GetChannelTopic",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/detail",
		GetChannelTopic,
	},

	route{
		"GetChannelTopicDetail",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/detail",
		GetChannelTopicDetail,
	},

	route{
		"GetChannelTopicSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/subject/{field}",
		GetChannelTopicSubjectField,
	},

	route{
		"GetChannelTopicTagSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}/subject/{field}",
		GetChannelTopicTagSubjectField,
	},

	route{
		"GetChannelTopicTags",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/tags",
		GetChannelTopicTags,
	},

	route{
		"GetChannelTopics",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics",
		GetChannelTopics,
	},

	route{
		"GetChannels",
		strings.ToUpper("Get"),
		"/content/channels",
		GetChannels,
	},

	route{
		"RemoveChannel",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}",
		RemoveChannel,
	},

	route{
		"RemoveChannelTopicAsset",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}/assets/{assetID}",
		RemoveChannelTopicAsset,
	},

	route{
		"RemoveChannelTopic",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}",
		RemoveChannelTopic,
	},

	route{
		"RemoveChannelTopicTag",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}",
		RemoveChannelTopicTag,
	},

	route{
		"SetChannelCard",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/cards/{cardID}",
		SetChannelCard,
	},

	route{
		"SetChannelTopicConfirmed",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/confirmed",
		SetChannelTopicConfirmed,
	},

	route{
		"SetChannelGroup",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/groups/{groupID}",
		SetChannelGroup,
	},

  route{
    "GetChannelNotification",
    strings.ToUpper("Get"),
    "/content/channels/{channelID}/notification",
    GetChannelNotification,
  },

  route{
    "SetChannelNotification",
    strings.ToUpper("Put"),
    "/content/channels/{channelID}/notification",
    SetChannelNotification,
  },

	route{
		"SetChannelSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/subject",
		SetChannelSubject,
	},

	route{
		"SetChannelTopicSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/subject",
		SetChannelTopicSubject,
	},

	route{
		"SetChannelTopicTagSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}/subject",
		SetChannelTopicTagSubject,
	},

	route{
		"GetProfile",
		strings.ToUpper("Get"),
		"/profile",
		GetProfile,
	},

	route{
		"GetProfileImage",
		strings.ToUpper("Get"),
		"/profile/image",
		GetProfileImage,
	},

	route{
		"GetProfileMessage",
		strings.ToUpper("Get"),
		"/profile/message",
		GetProfileMessage,
	},

	route{
		"SetProfile",
		strings.ToUpper("Put"),
		"/profile/data",
		SetProfile,
	},

	route{
		"SetProfileImage",
		strings.ToUpper("Put"),
		"/profile/image",
		SetProfileImage,
	},

	route{
		"RemoveProfile",
		strings.ToUpper("Delete"),
		"/profile",
		RemoveProfile,
	},

	route{
		"Status",
		strings.ToUpper("Get"),
		"/status",
		Status,
	},
}
