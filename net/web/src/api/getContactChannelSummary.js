import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelSummary(server, token, channelId) {
  let summary = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/summary?contact=${token}`, { method: 'GET' });
  checkResponse(summary)
  return await summary.json()
}

