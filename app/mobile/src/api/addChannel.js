import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannel(server, token, type, data, cards ) {
  let params = { dataType: type, data: JSON.stringify(data), groups: [], cards };
  let channel = await fetchWithTimeout(`https://${server}/content/channels?agent=${token}`, { method: 'POST', body: JSON.stringify(params)} );
  checkResponse(channel);
  return await channel.json();
}

