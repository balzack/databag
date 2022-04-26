import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactProfile(server, guid, token) {
  let profile = await fetchWithTimeout(`https://${server}/profile/message?contact=${guid}.${token}`, { method: 'GET', });
  checkResponse(profile);
  return await profile.json()
}

