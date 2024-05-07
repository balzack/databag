import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannelTopic(server, token, channelId, topicId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let channel = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/topics/${topicId}?contact=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
