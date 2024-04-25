import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelSubject(token, channelId, dataType, data) {
  let params = { dataType, data: JSON.stringify(data) };
  let channel = await fetchWithTimeout(`/content/channels/${channelId}/subject?agent=${token}`, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
  checkResponse(channel);
  return await channel.json();
}
