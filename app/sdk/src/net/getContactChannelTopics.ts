import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { TopicEntity } from '../entities';

export async function getContactChannelTopics(node: string, secure: boolean, guidToken: string, channelId: string, revision: number | null, count: number | null, begin: number | null, end: number | null): Promise<{ marker: number, revision: number, topics: TopicEntity[]}> {
  const params = (revision ? `&revision=${revision}` : '') + (count ? `&count=${count}` : '') + (begin ? `&begin=${begin}` : '') + (end ? `&end=${end}` : '');
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics?contact=${guidToken}${params}`;
  const topics = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(topics.status);
  return {
    marker: parseInt(topics.headers.get('topic-marker') || '0'),
    revision: parseInt(topics.headers.get('topic-revision') || '0'),
    topics: await topics.json(),
  }
}
