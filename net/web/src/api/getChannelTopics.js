import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelTopics(token, channelId, revision) {
  let rev = ''
  if (revision != null) {
    rev = `&revision=${revision}`
  }
  let topics = await fetchWithTimeout(`/content/channels/${channelId}/topics?agent=${token}${rev}`, 
    { method: 'GET' });
  checkResponse(topics)
  return await topics.json()
}

