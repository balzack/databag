import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelDetail(token, channelId) {
  let detail = await fetchWithTimeout(`/content/channels/${channelId}/detail?agent=${token}`, { method: 'GET' });
  checkResponse(detail);
  return await detail.json();
}
