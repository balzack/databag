import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopic(token, channelId, topicId) {
  let topic = await fetchWithTimeout(`/content/channels/${channelId}/topics/${topicId}/detail?contact=${token}`, 
    { method: 'GET' });
  checkResponse(topic)
  return await topic.json()
}

