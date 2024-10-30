import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ChannelEntity } from '../entities';

export async function getChannels(node: string, secure: boolean, token: string, revision: number, types: string[]): Promise<ChannelEntity[]> {
  const params = (revision ? `&revision=${revision}` : '') + `&types=${encodeURIComponent(JSON.stringify(types))}`;
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels?agent=${token}${params}`;
  const channels = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(channels.status);
  return await channels.json();
}
