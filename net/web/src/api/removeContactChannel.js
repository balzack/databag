import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannel(server, token, channelId) {
  
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}?contact=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
