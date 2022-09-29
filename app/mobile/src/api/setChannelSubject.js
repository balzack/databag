import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelSubject(server, token, channelId, subject ) {
  let data = { subject };
  let params = { dataType: 'superbasic', data: JSON.stringify(data) };
  let channel = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/subject?agent=${token}`, { method: 'PUT', body: JSON.stringify(params)} );
  checkResponse(channel);
  return await channel.json();
}
