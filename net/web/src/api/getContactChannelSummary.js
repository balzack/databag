import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelSummary(token, channelId) {
  let summary = await fetchWithTimeout(`/content/channels/${channelId}/summary?contact=${token}`, { method: 'GET' });
  checkResponse(summary)
  return await summary.json()
}

