import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setProfileImage(server, token, image) {
  let profile = await fetchWithTimeout(`https://${server}/profile/image?agent=${token}`, { method: 'PUT', body: JSON.stringify(image) });
  checkResponse(profile)
  return await profile.json()
}

