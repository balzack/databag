import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelTopic(server, token, channelId, topicId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let topic = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/topics/${topicId}/detail?agent=${token}`, 
    { method: 'GET' });
  checkResponse(topic)
  return await topic.json()
}

