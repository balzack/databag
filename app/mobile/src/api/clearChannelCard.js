import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function clearChannelCard(server, token, channelId, cardId ) {
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/cards/${cardId}?agent=${token}`, {method: 'DELETE'});
  checkResponse(channel);
  return await channel.json();
}
