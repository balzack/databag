import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeChannel(server, token, channelId) {
  
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}?agent=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
