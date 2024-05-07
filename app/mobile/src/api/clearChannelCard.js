import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function clearChannelCard(server, token, channelId, cardId ) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let channel = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/cards/${cardId}?agent=${token}`, {method: 'DELETE'});
  checkResponse(channel);
  return await channel.json();
}
