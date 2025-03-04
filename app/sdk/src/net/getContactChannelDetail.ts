import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ChannelDetailEntity } from '../entities';

export async function getContactChannelDetail(server: string, secure: boolean, guid: string, token: string, channelId: string): Promise<ChannelDetailEntity> {
  const endpoint = `http${secure ? 's' : ''}://${server}/content/channels/${channelId}/detail?contact=${guid}.${token}`;
  const detail = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(detail.status);
  return await detail.json();
}
