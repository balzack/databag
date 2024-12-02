import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeChannelTopic(node: string, secure: boolean, token: string, channelId: string, topicId: string): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/${topics}/${topicId}?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}
