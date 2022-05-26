import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannelTopic(server, token, channelId, topicId) {
  
  let channel = await fetchWithTimeout(`https://${server}//content/channels/${channelId}/topics/${topicId}?contact=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
