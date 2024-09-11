import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setProfileImage(node: string, secure: boolean, token: string, image: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/profile/image?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(image) });
  checkResponse(status);
}
