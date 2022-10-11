import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelCard(server, token, channelId, cardId ) {
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/cards/${cardId}?agent=${token}`, {method: 'PUT'});
  checkResponse(channel);
  return await channel.json();
}
