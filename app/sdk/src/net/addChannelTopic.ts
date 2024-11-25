import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannelTopic(node: string, secure: boolean, token: string, channelId: string, dataType: string, data: any, confirm: boolean) {
  const subject = { data: JSON.stringify(data), dataType };
  const endpoint = `http${secure ? 's' : '' }://${node}/content/channels/${channelId}/topics?agent=${token}&confirm=${confirm}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(subject) });
  checkResponse(status);
}   

