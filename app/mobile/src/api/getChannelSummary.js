import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelSummary(server, token, channelId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let summary = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/summary?agent=${token}`, { method: 'GET' });
  checkResponse(summary)
  return await summary.json()
}

