import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelDetail(token, channelId) {
  let detail = await fetchWithTimeout(`/content/channels/${channelId}/detail?contact=${token}`, { method: 'GET' });
  checkResponse(detail)
  return await detail.json()
}

