import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopics(token, channelId, revision) {
  let rev = ''
  if (revision != null) {
    rev = `&revision=${revision}`
  }
  let topics = await fetchWithTimeout(`/content/channels/${channelId}/topics?contact=${token}${rev}`, 
    { method: 'GET' });
  checkResponse(topics)
  return await topics.json()
}

