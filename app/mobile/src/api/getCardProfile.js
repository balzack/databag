import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardProfile(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let profile = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}/profile?agent=${token}`, { method: 'GET' });
  checkResponse(profile);
  return await profile.json()
}

