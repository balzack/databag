import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopic(server, token, channelId, topicId) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let topic = await fetchWithTimeout(`${host}/content/channels/${channelId}/topics/${topicId}/detail?contact=${token}`, 
    { method: 'GET' });
  checkResponse(topic)
  return await topic.json()
}

