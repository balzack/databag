import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannel(server, token, type, data, cards ) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let params = { dataType: type, data: JSON.stringify(data), groups: [], cards };
  let channel = await fetchWithTimeout(`${protocol}://${server}/content/channels?agent=${token}`, { method: 'POST', body: JSON.stringify(params)} );
  checkResponse(channel);
  return await channel.json();
}

