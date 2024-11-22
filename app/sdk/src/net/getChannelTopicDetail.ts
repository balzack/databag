import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { TopicDetailEntity } from '../entities';

export async function getChannelTopicDetail(node: string, secure: boolean, token: string, channelId: string, topicId: string): Promise<TopicDetailEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics/${topicId}/detail?agent=${token}`;
  const detail = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(detail.status);
  return await detail.json();
}

