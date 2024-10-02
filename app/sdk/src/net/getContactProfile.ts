import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { DataMessage } from '../entities';

export async function getContactProfile(node: string, secure: boolean, guid: string, token: string): Promise<DataMessage> {
  const endpoint = `http${secure ? 's' : ''}://${node}/profile/message?contact=${guid}.${token}`;
  const profile = await fetchWithTimeout(endpoint, { method: 'GET' })
  checkResponse(profile.status);
  return await profile.json();
}

