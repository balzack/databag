import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopics(server, token, channelId, revision) {
  let rev = ''
  if (revision != null) {
    rev = `&revision=${revision}`
  }
  let topics = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics?contact=${token}${rev}`, 
    { method: 'GET' });
  checkResponse(topics)
  return await topics.json()
}

