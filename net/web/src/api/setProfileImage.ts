import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setProfileImage(token, image) {
  let profile = await fetchWithTimeout(`/profile/image?agent=${token}`, { method: 'PUT', body: JSON.stringify(image) });
  checkResponse(profile);
  return await profile.json();
}
