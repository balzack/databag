import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelSubject(node: string, secure: boolean, token: string, channelId: string, type: string, data: any): Promise<void> {
  const params = { dataType: type, data: JSON.stringify(data) }; 
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/subject?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  checkResponse(status);
}

