import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setProfileData(node: string, secure: boolean, token: string, name: string, location: string, description: string): Promise<void> {
  const data = { name: name, location: location, description: description };
  const endpoint = `http${secure ? 's' : ''}://${node}/profile/data?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  checkResponse(status);
}
