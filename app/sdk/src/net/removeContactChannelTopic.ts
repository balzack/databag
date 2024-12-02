import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactChannelTopic(node: string, secure: boolean, guidToken: string, channelId: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics/${topicId}?contact=${guidToken}`;
  const response = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(response.status);
}
