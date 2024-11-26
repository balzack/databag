import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelTopicSubject(node: string, secure: boolean, token: string, channelId: string, topicId: string, dataType: string, data: any) {
  const subject = { data: JSON.stringify(data), dataType };
  const endpoint = `http${secure ? 's' : '' }://${node}/content/channels/${channelId}/topics?agent=${token}&confirm=true`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  checkResponse(status);
}   

