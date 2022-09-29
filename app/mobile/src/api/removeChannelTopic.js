import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeChannelTopic(server, token, channelId, topicId) {
  
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${topicId}?agent=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
