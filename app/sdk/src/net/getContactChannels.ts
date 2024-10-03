import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ChannelEntity } from '../entities';

export async function getContactChannels(node: string, secure: boolean, guid: string, token: string, revision: number, types: string[]): Promise<ChannelEntity> {
  const type = `types=${encodeURIComponent(JSON.stringify(types))}`;
  const param = revision ? `viewRevision=1&channelRevision=${revision}` : `viewRevision=1`;
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels?contact=${guid}.${token}&${param}&${type}`;
  const channels = await fetchWithTimeout(endpoint, { method: 'GET' })
  checkResponse(channels.status);
  return await channels.json();
}

