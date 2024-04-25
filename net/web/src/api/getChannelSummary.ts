import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelSummary(token, channelId) {
  let summary = await fetchWithTimeout(`/content/channels/${channelId}/summary?agent=${token}`, { method: 'GET' });
  checkResponse(summary);
  return await summary.json();
}
