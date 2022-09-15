import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelDetail(server, token, channelId) {
  let detail = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/detail?agent=${token}`, { method: 'GET' });
  checkResponse(detail)
  return await detail.json()
}

