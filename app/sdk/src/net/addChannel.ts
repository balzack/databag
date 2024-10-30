import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannel(node: string, secure: boolean, token: string, type: string, data: any, cards: string[]) {
  const params = { dataType: type, data: JSON.stringify(data), groups: [], cards };
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels?agent=${token}`;
  const channel = await fetchWithTimeout(endpoint, {
    method: 'POST',
    body: JSON.stringify(params),
  });
  checkResponse(channel.status);
  return await channel.json();
}
