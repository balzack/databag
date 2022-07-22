package databag

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

func NewRouter() *mux.Router {

	go SendNotifications()

	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
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

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World!")
}

var routes = Routes{

	Route{
		"AddAccount",
		strings.ToUpper("Post"),
		"/account/profile",
		AddAccount,
	},

	Route{
		"AddAccountApp",
		strings.ToUpper("Post"),
		"/account/apps",
		AddAccountApp,
	},

	Route{
		"AddAccountAuthentication",
		strings.ToUpper("Post"),
		"/account/auth",
		AddAccountAuthentication,
	},

	Route{
		"GetAccountApps",
		strings.ToUpper("Get"),
		"/account/apps",
		GetAccountApps,
	},

	Route{
		"GetAccountAsset",
		strings.ToUpper("Get"),
		"/account/assets/{assetID}",
		GetAccountAsset,
	},

	Route{
		"GetAccountListing",
		strings.ToUpper("Get"),
		"/account/listing",
		GetAccountListing,
	},

	Route{
		"GetAccountListingImage",
		strings.ToUpper("Get"),
		"/account/listing/{guid}/image",
		GetAccountListingImage,
	},

	Route{
		"GetAccountListingMessage",
		strings.ToUpper("Get"),
		"/account/listing/{guid}/message",
		GetAccountListingMessage,
	},

	Route{
		"GetAccountStatus",
		strings.ToUpper("Get"),
		"/account/status",
		GetAccountStatus,
	},

	Route{
		"GetAccountToken",
		strings.ToUpper("Get"),
		"/account/token",
		GetAccountToken,
	},

	Route{
		"GetAccountAvailable",
		strings.ToUpper("Get"),
		"/account/available",
		GetAccountAvailable,
	},

	Route{
		"GetAccountUsername",
		strings.ToUpper("Get"),
		"/account/username",
		GetAccountUsername,
	},

	Route{
		"RemoveAccount",
		strings.ToUpper("Delete"),
		"/account/profile",
		RemoveAccount,
	},

	Route{
		"RemoveAccountApp",
		strings.ToUpper("Delete"),
		"/account/apps/{appID}",
		RemoveAccountApp,
	},

	Route{
		"SetAccountAccess",
		strings.ToUpper("Put"),
		"/account/access",
		SetAccountAccess,
	},

	Route{
		"SetAccountAuthentication",
		strings.ToUpper("Put"),
		"/account/auth",
		SetAccountAuthentication,
	},

	Route{
		"SetAccountExport",
		strings.ToUpper("Put"),
		"/account/export",
		SetAccountExport,
	},

	Route{
		"SetAccountNode",
		strings.ToUpper("Put"),
		"/account/node",
		SetAccountNode,
	},

	Route{
		"SetAccountLogin",
		strings.ToUpper("Put"),
		"/account/login",
		SetAccountLogin,
	},

	Route{
		"SetAccountSerchable",
		strings.ToUpper("Put"),
		"/account/searchable",
		SetAccountSearchable,
	},

	Route{
		"AddNodeAccount",
		strings.ToUpper("Post"),
		"/admin/accounts",
		AddNodeAccount,
	},

	Route{
		"GetNodeAccountImage",
		strings.ToUpper("Get"),
		"/admin/accounts/{accountID}/image",
		GetNodeAccountImage,
	},

	Route{
		"SetNodeAccountStatus",
		strings.ToUpper("Put"),
		"/admin/accounts/{accountID}/status",
		SetNodeAccountStatus,
	},

	Route{
		"AddNodeAccountAccess",
		strings.ToUpper("Post"),
		"/admin/accounts/{accountID}/auth",
		AddNodeAccountAccess,
	},

	Route{
		"GetNodeAccounts",
		strings.ToUpper("Get"),
		"/admin/accounts",
		GetNodeAccounts,
	},

	Route{
		"GetNodeConfig",
		strings.ToUpper("Get"),
		"/admin/config",
		GetNodeConfig,
	},

	Route{
		"GetNodeStatus",
		strings.ToUpper("Get"),
		"/admin/status",
		GetNodeStatus,
	},

	Route{
		"ImportAccount",
		strings.ToUpper("Post"),
		"/admin/accounts/import",
		ImportAccount,
	},

	Route{
		"RemoveNodeAccount",
		strings.ToUpper("Delete"),
		"/admin/accounts/{accountID}",
		RemoveNodeAccount,
	},

	Route{
		"SetNodeAccount",
		strings.ToUpper("Put"),
		"/admin/accounts/{accountID}/reset",
		SetNodeAccount,
	},

	Route{
		"SetNodeConfig",
		strings.ToUpper("Put"),
		"/admin/config",
		SetNodeConfig,
	},

	Route{
		"SetNodeStatus",
		strings.ToUpper("Put"),
		"/admin/status",
		SetNodeStatus,
	},

	Route{
		"AddGroup",
		strings.ToUpper("Post"),
		"/alias/groups",
		AddGroup,
	},

	Route{
		"GetGroupSubjectField",
		strings.ToUpper("Get"),
		"/alias/groups/{groupID}/subject/{field}",
		GetGroupSubjectField,
	},

	Route{
		"GetGroups",
		strings.ToUpper("Get"),
		"/alias/groups",
		GetGroups,
	},

	Route{
		"RemoveGroup",
		strings.ToUpper("Delete"),
		"/alias/groups/{groupID}",
		RemoveGroup,
	},

	Route{
		"SetGroupSubject",
		strings.ToUpper("Put"),
		"/alias/groups/{groupID}/subject",
		SetGroupSubject,
	},

	Route{
		"AddArticle",
		strings.ToUpper("Post"),
		"/attribute/articles",
		AddArticle,
	},

	Route{
		"ClearArticleGroup",
		strings.ToUpper("Delete"),
		"/attribute/articles/{articleID}/groups/{groupID}",
		ClearArticleGroup,
	},

	Route{
		"GetArticleSubjectField",
		strings.ToUpper("Get"),
		"/attribute/articles/{articleID}/subject/{field}",
		GetArticleSubjectField,
	},

	Route{
		"GetArticles",
		strings.ToUpper("Get"),
		"/attribute/articles",
		GetArticles,
	},

	Route{
		"RemoveArticle",
		strings.ToUpper("Delete"),
		"/attribute/articles/{articleID}",
		RemoveArticle,
	},

	Route{
		"SetArticleGroup",
		strings.ToUpper("Put"),
		"/attribute/articles/{articleID}/groups/{groupID}",
		SetArticleGroup,
	},

	Route{
		"SetArticleSubject",
		strings.ToUpper("Put"),
		"/attribute/articles/{articleID}/subject",
		SetArticleSubject,
	},

	Route{
		"Authorize",
		strings.ToUpper("Put"),
		"/authorize",
		Authorize,
	},

	Route{
		"AddCard",
		strings.ToUpper("Post"),
		"/contact/cards",
		AddCard,
	},

	Route{
		"ClearCardGroup",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}/groups/{groupID}",
		ClearCardGroup,
	},

	Route{
		"ClearCardNotes",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}/notes",
		ClearCardNotes,
	},

	Route{
		"GetCardDetail",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/detail",
		GetCardDetail,
	},

	Route{
		"GetCardProfile",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/profile",
		GetCardProfile,
	},

	Route{
		"GetCardProfileImage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/profile/image",
		GetCardProfileImage,
	},

	Route{
		"GetCards",
		strings.ToUpper("Get"),
		"/contact/cards",
		GetCards,
	},

	Route{
		"GetCloseMessage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/closeMessage",
		GetCloseMessage,
	},

	Route{
		"GetOpenMessage",
		strings.ToUpper("Get"),
		"/contact/cards/{cardID}/openMessage",
		GetOpenMessage,
	},

	Route{
		"RemoveCard",
		strings.ToUpper("Delete"),
		"/contact/cards/{cardID}",
		RemoveCard,
	},

	Route{
		"SetArticleRevision",
		strings.ToUpper("Put"),
		"/contact/article/revision",
		SetArticleRevision,
	},

	Route{
		"SetCardGroup",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/groups/{groupID}",
		SetCardGroup,
	},

	Route{
		"SetCardNotes",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/notes",
		SetCardNotes,
	},

	Route{
		"SetCardProfile",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/profile",
		SetCardProfile,
	},

	Route{
		"SetCardStatus",
		strings.ToUpper("Put"),
		"/contact/cards/{cardID}/status",
		SetCardStatus,
	},

	Route{
		"SetChannelRevision",
		strings.ToUpper("Put"),
		"/contact/channel/revision",
		SetChannelRevision,
	},

	Route{
		"SetCloseMessage",
		strings.ToUpper("Put"),
		"/contact/closeMessage",
		SetCloseMessage,
	},

	Route{
		"SetOpenMessage",
		strings.ToUpper("Put"),
		"/contact/openMessage",
		SetOpenMessage,
	},

	Route{
		"SetProfileRevision",
		strings.ToUpper("Put"),
		"/contact/profile/revision",
		SetProfileRevision,
	},

	Route{
		"SetViewRevision",
		strings.ToUpper("Put"),
		"/contact/view/revision",
		SetViewRevision,
	},

	Route{
		"AddChannel",
		strings.ToUpper("Post"),
		"/content/channels",
		AddChannel,
	},

	Route{
		"AddChannelTopicAsset",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics/{topicID}/assets",
		AddChannelTopicAsset,
	},

	Route{
		"AddChannelTopic",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics",
		AddChannelTopic,
	},

	Route{
		"AddChannelTopicTag",
		strings.ToUpper("Post"),
		"/content/channels/{channelID}/topics/{topicID}/tags",
		AddChannelTopicTag,
	},

	Route{
		"ClearChannelCard",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/cards/{cardID}",
		ClearChannelCard,
	},

	Route{
		"ClearChannelGroup",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/groups/{groupID}",
		ClearChannelGroup,
	},

	Route{
		"GetChannelTopicAsset",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/assets/{assetID}",
		GetChannelTopicAsset,
	},

	Route{
		"GetChannelTopicAssets",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/assets",
		GetChannelTopicAssets,
	},

	Route{
		"GetChannelDetail",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/detail",
		GetChannelDetail,
	},

	Route{
		"GetChannelSummary",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/summary",
		GetChannelSummary,
	},

	Route{
		"GetChannelSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/subject/{field}",
		GetChannelSubjectField,
	},

	Route{
		"GetChannelTopic",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/detail",
		GetChannelTopic,
	},

	Route{
		"GetChannelTopicDetail",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/detail",
		GetChannelTopicDetail,
	},

	Route{
		"GetChannelTopicSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/subject/{field}",
		GetChannelTopicSubjectField,
	},

	Route{
		"GetChannelTopicTagSubjectField",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}/subject/{field}",
		GetChannelTopicTagSubjectField,
	},

	Route{
		"GetChannelTopicTags",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics/{topicID}/tags",
		GetChannelTopicTags,
	},

	Route{
		"GetChannelTopics",
		strings.ToUpper("Get"),
		"/content/channels/{channelID}/topics",
		GetChannelTopics,
	},

	Route{
		"GetChannels",
		strings.ToUpper("Get"),
		"/content/channels",
		GetChannels,
	},

	Route{
		"RemoveChannel",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}",
		RemoveChannel,
	},

	Route{
		"RemoveChannelTopicAsset",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}/assets/{assetID}",
		RemoveChannelTopicAsset,
	},

	Route{
		"RemoveChannelTopic",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}",
		RemoveChannelTopic,
	},

	Route{
		"RemoveChannelTopicTag",
		strings.ToUpper("Delete"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}",
		RemoveChannelTopicTag,
	},

	Route{
		"SetChannelCard",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/cards/{cardID}",
		SetChannelCard,
	},

	Route{
		"SetChannelTopicConfirmed",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/confirmed",
		SetChannelTopicConfirmed,
	},

	Route{
		"SetChannelGroup",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/groups/{groupID}",
		SetChannelGroup,
	},

	Route{
		"SetChannelSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/subject",
		SetChannelSubject,
	},

	Route{
		"SetChannelTopicSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/subject",
		SetChannelTopicSubject,
	},

	Route{
		"SetChannelTopicTagSubject",
		strings.ToUpper("Put"),
		"/content/channels/{channelID}/topics/{topicID}/tags/{tagID}/subject",
		SetChannelTopicTagSubject,
	},

	Route{
		"GetProfile",
		strings.ToUpper("Get"),
		"/profile",
		GetProfile,
	},

	Route{
		"GetProfileImage",
		strings.ToUpper("Get"),
		"/profile/image",
		GetProfileImage,
	},

	Route{
		"GetProfileMessage",
		strings.ToUpper("Get"),
		"/profile/message",
		GetProfileMessage,
	},

	Route{
		"SetProfile",
		strings.ToUpper("Put"),
		"/profile/data",
		SetProfile,
	},

	Route{
		"SetProfileImage",
		strings.ToUpper("Put"),
		"/profile/image",
		SetProfileImage,
	},

	Route{
		"Status",
		strings.ToUpper("Get"),
		"/status",
		Status,
	},
}
