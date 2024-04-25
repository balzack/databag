import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelSummary(server, token, channelId) {
  let host = '';
  if (server) {
    host = `https://${server}`;
  }
  let summary = await fetchWithTimeout(`${host}/content/channels/${channelId}/summary?contact=${token}`, {
    method: 'GET',
  });
  checkResponse(summary);
  return await summary.json();
}
