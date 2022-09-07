import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannel(token, cards, subject, description ) {
  let data = { subject, description };
  let params = { dataType: 'superbasic', data: JSON.stringify(data), groups: [], cards };
  let channel = await fetchWithTimeout(`/content/channels?agent=${token}`, { method: 'POST', body: JSON.stringify(params)} );
  checkResponse(channel);
  return await channel.json();
}

