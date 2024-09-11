import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ProfileEntity } from '../entities';

export async function getProfile(node: string, secure: boolean, token: string): Promise<ProfileEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/profile?agent=${token}`;
  const profile = await fetchWithTimeout(endpoint, { method: 'GET' })
  checkResponse(profile.status);
  return await profile.json();
}

