import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelDetail(server, token, channelId) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }
  let detail = await fetchWithTimeout(`${host}/content/channels/${channelId}/detail?contact=${token}`, { method: 'GET' });
  checkResponse(detail)
  return await detail.json()
}

