import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactProfile(server, token) {
  let profile = await fetchWithTimeout(`https://${server}/profile/message?contact=${token}`, { method: 'GET', });
  checkResponse(profile);
  return await profile.json()
}

