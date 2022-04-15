import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannel(token, channelId) {
  let channel = await fetchWithTimeout(`/content/channels/${channelId}/detail?contact=${token}`, { method: 'GET' });
  checkResponse(channel)
  return await channel.json()
}

