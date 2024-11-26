import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setContactChannelTopicSubject(node: string, secure: boolean, guidToken: string, channelId: topicId: string, dataType: string, data: any) {
  const subject = { data: JSON.stringify(data), dataType };
  const endpoint = `http${secure ? 's' : '' }://${node}/content/channels/${channelId}/topics/${topicId}/subject?contact=${guidToken}&confirm=true`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(subject) });
  checkResponse(status);
}   

