import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannel(server, token, channelId) {
  let host = '';
  if (server) {
    host = `https://${server}`;
  }

  let channel = await fetchWithTimeout(`${host}/content/channels/${channelId}?contact=${token}`, { method: 'DELETE' });
  checkResponse(channel);
}
