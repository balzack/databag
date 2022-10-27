import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeProfile(server, token) {
  let profile = await fetchWithTimeout(`https://${server}/profile?agent=${token}`, { method: 'DELETE' });
  checkResponse(profile)
}

