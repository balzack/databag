package databag

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"net/url"
	"testing"
)

func TestTopicShare(t *testing.T) {
	var topic *Topic
	var channel *Channel
	var detail *ChannelDetail
	var subject *Subject
	params := make(map[string]string)
	header := make(map[string][]string)
	var err error
	var data []byte
	var aRev *Revision
	var cRev *Revision

	// setup testing group
	set, err := AddTestGroup("topicshare")
	assert.NoError(t, err)

	// add new channel
	channel = &Channel{}
	subject = &Subject{Data: "channeldata", DataType: "channeldatatype"}
	assert.NoError(t, APITestMsg(AddChannel, "POST", "/content/channels",
		nil, subject, APPTokenAgent, set.A.Token, channel, nil))
	image := "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"
	img, _ := base64.StdEncoding.DecodeString(image)
	subject = &Subject{Data: "{ \"nested\" : { \"image\" : \"" + image + "\" } }", DataType: "nestedimage"}
	params["channelID"] = channel.ID
	assert.NoError(t, APITestMsg(SetChannelSubject, "PUT", "/content/channels/{channelID}/subject",
		&params, subject, APPTokenAgent, set.A.Token, channel, nil))
	params["cardID"] = set.A.B.CardID
	assert.NoError(t, APITestMsg(SetChannelCard, "PUT", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))
	params["cardID"] = set.A.C.CardID
	assert.NoError(t, APITestMsg(SetChannelCard, "PUT", "/content/channels/{channelID}/cards/{cardID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))

	// view channel
	detail = &ChannelDetail{}
	assert.NoError(t, APITestMsg(GetChannelDetail, "GET", "/content/channels/{channelID}/detail",
		&params, nil, APPTokenAgent, set.A.Token, detail, nil))
	assert.NotNil(t, detail)
	detail = &ChannelDetail{}
	assert.NoError(t, APITestMsg(GetChannelDetail, "GET", "/content/channels/{channelID}/detail",
		&params, nil, APPTokenContact, set.B.A.Token, detail, nil))
	assert.NotNil(t, channel.Data.ChannelDetail)
	detail = &ChannelDetail{}
	assert.NoError(t, APITestMsg(GetChannelDetail, "GET", "/content/channels/{channelID}/detail",
		&params, nil, APPTokenContact, set.B.A.Token, detail, nil))
	assert.NotNil(t, channel.Data.ChannelDetail)
	params["field"] = "nested.image"
	data, header, err = APITestData(GetChannelSubjectField, "GET", "/content/channels/{channelID}/subject/{field}",
		&params, nil, APPTokenAgent, set.A.Token, 0, 0)
	assert.NoError(t, err)
	assert.Equal(t, "image/png", header["Content-Type"][0])
	assert.Zero(t, bytes.Compare(img, data))
	data, header, err = APITestData(GetChannelSubjectField, "GET", "/content/channels/{channelID}/subject/{field}",
		&params, nil, APPTokenContact, set.B.A.Token, 0, 0)
	assert.NoError(t, err)
	assert.Equal(t, "image/png", header["Content-Type"][0])
	assert.Zero(t, bytes.Compare(img, data))
	data, header, err = APITestData(GetChannelSubjectField, "GET", "/content/channels/{channelID}/subject/{field}",
		&params, nil, APPTokenContact, set.C.A.Token, 0, 0)
	assert.NoError(t, err)
	assert.Equal(t, "image/png", header["Content-Type"][0])
	assert.Zero(t, bytes.Compare(img, data))

	// add a topc
	topic = &Topic{}
	subject = &Subject{DataType: "topicdatatype", Data: "subjectfromA"}
	assert.NoError(t, APITestMsg(AddChannelTopic, "POST", "/content/channels/{channelID}/topics",
		&params, subject, APPTokenAgent, set.A.Token, topic, nil))
	topic = &Topic{}
	subject = &Subject{DataType: "topicdatatype", Data: "subjectfromB"}
	assert.NoError(t, APITestMsg(AddChannelTopic, "POST", "/content/channels/{channelID}/topics",
		&params, subject, APPTokenContact, set.B.A.Token, topic, nil))
	params["topicID"] = topic.ID
	assert.NoError(t, APITestMsg(SetChannelTopicConfirmed, "PUT", "/content/channels/{channelID}/topics/{topicID}/confirmed",
		&params, APPTopicConfirmed, APPTokenContact, set.B.A.Token, nil, nil))
	topic = &Topic{}
	subject = &Subject{DataType: "topicdatatype", Data: "subjectfromC"}
	assert.NoError(t, APITestMsg(AddChannelTopic, "POST", "/content/channels/{channelID}/topics",
		&params, subject, APPTokenContact, set.C.A.Token, topic, nil))

	// add asset to topic
	assets := []Asset{}
	params["topicID"] = topic.ID
	transforms, err := json.Marshal([]string{"copy;photo"})
	assert.NoError(t, err)
	assert.NoError(t, APITestUpload(AddChannelTopicAsset, "POST", "/content/channels/{channelID}/topics/{topicID}/assets?transforms="+url.QueryEscape(string(transforms)),
		&params, img, APPTokenContact, set.C.A.Token, &assets, nil))

	// view topics
	topics := &[]Topic{}
	assert.NoError(t, APITestMsg(GetChannelTopics, "GET", "/content/channels/{channelID}/topics",
		&params, nil, APPTokenAgent, set.A.Token, topics, nil))

	aRev = GetTestRevision(set.A.Revisions)
	cRev = GetTestRevision(set.C.Revisions)

	// add a tag to topic
	tag := Tag{}
	subject = &Subject{DataType: "tagdatatype", Data: "subjectfromA"}
	assert.NoError(t, APITestMsg(AddChannelTopicTag, "POST", "/content/channels/{channelID}/topics/{topicID}",
		&params, subject, APPTokenAgent, set.A.Token, &tag, nil))

	assert.NotEqual(t, aRev.Channel, GetTestRevision(set.A.Revisions).Channel)
	assert.NotEqual(t, cRev.Card, GetTestRevision(set.C.Revisions).Card)

	// get tags for topic
	tags := &[]Tag{}
	assert.NoError(t, APITestMsg(GetChannelTopicTags, "GET", "/content/channels/{channelID}/topics/{topicID}",
		&params, nil, APPTokenContact, set.C.A.Token, tags, nil))
	assert.Equal(t, 1, len(*tags))

	// delete topic tag
	params["tagID"] = tag.ID
	assert.NoError(t, APITestMsg(RemoveChannelTopicTag, "DELETE", "/content/channels/{channelID}/topics/{topicID}/tags/{tagID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))

	// get tags for topic
	tags = &[]Tag{}
	assert.NoError(t, APITestMsg(GetChannelTopicTags, "GET", "/content/channels/{channelID}/topics/{topicID}",
		&params, nil, APPTokenContact, set.C.A.Token, tags, nil))
	assert.Equal(t, 0, len(*tags))

	// get list of assets
	assets = []Asset{}
	assert.NoError(t, APITestMsg(GetChannelTopicAssets, "GET", "/content/channels/{channelID}/topics/{topicID}",
		&params, nil, APPTokenContact, set.C.A.Token, &assets, nil))
	assert.Equal(t, 2, len(assets))

	// delete each asset
	for _, asset := range assets {
		params["assetID"] = asset.AssetID
		assert.NoError(t, APITestMsg(RemoveChannelTopicAsset, "DELETE", "/content/channels/{channelID}/topics/{topicID}/assets/{assetID}",
			&params, nil, APPTokenContact, set.C.A.Token, nil, nil))
	}

	// get list of assets
	assets = []Asset{}
	assert.NoError(t, APITestMsg(GetChannelTopicAssets, "GET", "/content/channels/{channelID}/topics/{topicID}",
		&params, nil, APPTokenContact, set.C.A.Token, &assets, nil))
	assert.Equal(t, 0, len(assets))

	// add asset to topic
	assets = []Asset{}
	params["topicID"] = topic.ID
	transforms, err = json.Marshal([]string{"copy;photo"})
	assert.NoError(t, err)
	assert.NoError(t, APITestUpload(AddChannelTopicAsset, "POST", "/content/channels/{channelID}/topics/{topicID}/assets?transforms="+url.QueryEscape(string(transforms)),
		&params, img, APPTokenContact, set.C.A.Token, &assets, nil))

	// add a tag to topic
	tag = Tag{}
	subject = &Subject{DataType: "tagdatatype", Data: "subjectfromA"}
	assert.NoError(t, APITestMsg(AddChannelTopicTag, "POST", "/content/channels/{channelID}/topics/{topicID}",
		&params, subject, APPTokenAgent, set.A.Token, &tag, nil))

	// remove channel
	assert.NoError(t, APITestMsg(RemoveChannel, "DELETE", "/content/channels/{channelID}",
		&params, nil, APPTokenAgent, set.A.Token, nil, nil))
}
