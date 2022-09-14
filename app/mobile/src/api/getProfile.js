import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getProfile(server, token) {
  let profile = await fetchWithTimeout(`https://${server}/profile?agent=${token}`, { method: 'GET' });
  checkResponse(profile)
  return await profile.json()
}


