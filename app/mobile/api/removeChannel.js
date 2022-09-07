import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeChannel(token, channelId) {
  
  let channel = await fetchWithTimeout(`/content/channels/${channelId}?agent=${token}`,
    { method: 'DELETE' });
  checkResponse(channel);
}
