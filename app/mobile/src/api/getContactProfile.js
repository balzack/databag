import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactProfile(server, guid, token) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let profile = await fetchWithTimeout(`${host}/profile/message?contact=${guid}.${token}`, { method: 'GET', });
  checkResponse(profile);
  return await profile.json()
}

