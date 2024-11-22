import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { TopicDetailEntity } from '../entities';

export async function getContactChannelTopicDetail(node: string, secure: boolean, guidToken: string, channelId: string, topicId: string): Promise<TopicDetailEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics/${topicId}/detail?contact=${guidToken}`;
  const detail = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(detail.status);
  return await detail.json();
}
