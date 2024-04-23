import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannelTopic(server, token, channelId, topicId) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let channel = await fetchWithTimeout(`${host}/content/channels/${channelId}/topics/${topicId}?contact=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
