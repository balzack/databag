import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactChannelTopic(node: string, secure: boolean, guidToken: string, channelId: string, dataType: string, data: any, confirm: boolean) {
  const subject = { data: JSON.stringify(data), dataType };
  const endpoint = `http${secure ? 's' : '' }://${node}/content/channels/${channelId}/topics?contact=${guidToken}&confirm=${confirm}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(data) });
  checkResponse(status);
}   

