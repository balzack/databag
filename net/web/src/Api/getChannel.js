import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannel(token, channelId) {
  let channel = await fetchWithTimeout(`/content/channels/${channelId}/detail?agent=${token}`, { method: 'GET' });
  checkResponse(channel)
  return await channel.json()
}

