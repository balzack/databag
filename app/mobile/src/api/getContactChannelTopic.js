import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopic(server, token, channelId, topicId) {
  let topic = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${topicId}/detail?contact=${token}`, 
    { method: 'GET' });
  checkResponse(topic)
  return await topic.json()
}

