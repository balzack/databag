import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ChannelDetailEntity } from '../entities';

export async function getChannelDetail(node: string, secure: boolean, token: string, channelId: string): Promise<ChannelDetailEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/detail?agent=${token}`;
  const detail = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(detail.status);
  return await detail.json();
}
