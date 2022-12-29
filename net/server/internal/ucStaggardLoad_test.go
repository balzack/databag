package databag

import (
	"github.com/stretchr/testify/assert"
	"strconv"
	"testing"
)

func TestStaggardLoad(t *testing.T) {
	var params *TestAPIParams
	var response *TestAPIResponse
	var channel *Channel
	var topic *Topic
	var topics *[]Topic

	// allocate test accounts
	set, err := AddTestGroup("staggardload")
	assert.NoError(t, err)

	// allocate new test app
	app := NewTestApp()
	go app.Connect(set.A.Token)

	// wait for test
	assert.NoError(t, app.WaitFor(func(testApp *TestApp) bool {
		if testApp.profile.Handle == "staggardloadA" {
			return true
		}
		return false
	}))

	// add a channel
	params = &TestAPIParams{
		restType: "POST",
		query:    "/content/channels",
		body: &Subject{
			Data:     "channeldataA",
			DataType: "channeldatatypeA",
		},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	channel = &Channel{}
	response = &TestAPIResponse{data: channel}
	assert.NoError(t, TestAPIRequest(AddChannel, params, response))

	// wait for test
	assert.NoError(t, app.WaitFor(func(testApp *TestApp) bool {
		for _, c := range testApp.channels {
			if c.channel.ID == channel.ID {
				return true
			}
		}
		return false
	}))

	// add a topic to channel
	ids := []string{}
	for i := 0; i < 128; i++ {
		params = &TestAPIParams{
			restType: "POST",
			query:    "/content/channels/{channelID}/topics",
			path:     map[string]string{"channelID": channel.ID},
			body: &Subject{
				Data:     strconv.Itoa(i),
				DataType: "channeltopicdatatypeA",
			},
			tokenType: APPTokenAgent,
			token:     set.A.Token,
		}
		topic = &Topic{}
		response = &TestAPIResponse{data: topic}
		assert.NoError(t, TestAPIRequest(AddChannelTopic, params, response))
		ids = append(ids, topic.ID)
	}

	// wait for test
	assert.NoError(t, app.WaitFor(func(testApp *TestApp) bool {
		for _, c := range testApp.channels {
			if c.channel.ID == channel.ID {
				if len(c.topics) == 128 {
					return true
				}
			}
		}
		return false
	}))

	params = &TestAPIParams{
		restType:  "GET",
		query:     "/content/channels/{channelID}/topics",
		path:      map[string]string{"channelID": channel.ID, "topicID": topic.ID},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	topics = &[]Topic{}
	response = &TestAPIResponse{data: topics}
	assert.NoError(t, TestAPIRequest(GetChannelTopics, params, response))
	assert.Equal(t, len(*topics), 128)

	params = &TestAPIParams{
		restType:  "GET",
		query:     "/content/channels/{channelID}/topics?count=13",
		path:      map[string]string{"channelID": channel.ID, "topicID": topic.ID},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	topics = &[]Topic{}
	response = &TestAPIResponse{data: topics}
	assert.NoError(t, TestAPIRequest(GetChannelTopics, params, response))
	assert.Equal(t, len(*topics), 13)

	revision := response.header["Topic-Revision"][0]

	params = &TestAPIParams{
		restType:  "GET",
		query:     "/content/channels/{channelID}/topics?count=13&end=" + response.header["Topic-Marker"][0],
		path:      map[string]string{"channelID": channel.ID, "topicID": topic.ID},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	topics = &[]Topic{}
	response = &TestAPIResponse{data: topics}
	assert.NoError(t, TestAPIRequest(GetChannelTopics, params, response))
	assert.Equal(t, len(*topics), 13)

	marker := response.header["Topic-Marker"][0]

	params = &TestAPIParams{
		restType:  "DELETE",
		query:     "/content/channels/{channelID}/topics/{topicID}",
		path:      map[string]string{"channelID": channel.ID, "topicID": ids[13]},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	response = &TestAPIResponse{}
	assert.NoError(t, TestAPIRequest(RemoveChannelTopic, params, response))

	params = &TestAPIParams{
		restType:  "GET",
		query:     "/content/channels/{channelID}/topics?begin=" + marker + "&revision=" + revision,
		path:      map[string]string{"channelID": channel.ID, "topicID": topic.ID},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	topics = &[]Topic{}
	response = &TestAPIResponse{data: topics}
	assert.NoError(t, TestAPIRequest(GetChannelTopics, params, response))
	assert.Equal(t, 0, len(*topics))

	params = &TestAPIParams{
		restType:  "DELETE",
		query:     "/content/channels/{channelID}/topics/{topicID}",
		path:      map[string]string{"channelID": channel.ID, "topicID": ids[108]},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	response = &TestAPIResponse{}
	assert.NoError(t, TestAPIRequest(RemoveChannelTopic, params, response))

	params = &TestAPIParams{
		restType:  "GET",
		query:     "/content/channels/{channelID}/topics?begin=" + marker + "&revision=" + revision,
		path:      map[string]string{"channelID": channel.ID, "topicID": topic.ID},
		tokenType: APPTokenAgent,
		token:     set.A.Token,
	}
	topics = &[]Topic{}
	response = &TestAPIResponse{data: topics}
	assert.NoError(t, TestAPIRequest(GetChannelTopics, params, response))
	assert.Equal(t, 1, len(*topics))
}
