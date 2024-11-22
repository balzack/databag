import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { TopicEntity } from '../entities';

export async function getChannelTopics(node: string, secure: boolean, token: string, channelId: stirng, revision: number | null, count: number | null, begin: number | null, end: number | null): Promise<{marker: number, revision: number, topics: TopicEntity[]}> {
  const params = (revision ? `&revision=${revision}` : '') + (count ? `&count=${count}` : '') + (begin ? `&begin=${begin}` : '') + (end ? `&end=${end}` : '');
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/topics?agent=${token}${params}`;
  const topics = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(topics.status);
  return {
    marker: topics.headers.get('topic-marker'),
    revision: topics.headers.get('topic-revision'),
    topics: await topics.json(),
  }
}

