import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setProfileData(token, name, location, description) {
  let data = { name: name, location: location, description: description };
  let profile = await fetchWithTimeout(`/profile/data?agent=${token}`, { method: 'PUT', body: JSON.stringify(data) });
  checkResponse(profile)
  return await profile.json()
}

