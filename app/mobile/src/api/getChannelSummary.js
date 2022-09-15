import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelSummary(server, token, channelId) {
  let summary = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/summary?agent=${token}`, { method: 'GET' });
  checkResponse(summary)
  return await summary.json()
}

