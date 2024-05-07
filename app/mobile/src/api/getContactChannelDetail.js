import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelDetail(server, token, channelId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let host = "";
  if (server) {
    host = `${protocol}://${server}`;
  }
  let detail = await fetchWithTimeout(`${host}/content/channels/${channelId}/detail?contact=${token}`, { method: 'GET' });
  checkResponse(detail)
  return await detail.json()
}

