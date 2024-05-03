import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelSummary(server, token, channelId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let host = "";
  if (server) {
    host = `${protocol}://${server}`;
  }
  let summary = await fetchWithTimeout(`${host}/content/channels/${channelId}/summary?contact=${token}`, { method: 'GET' });
  checkResponse(summary)
  return await summary.json()
}

