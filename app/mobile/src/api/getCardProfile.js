import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardProfile(server, token, cardId) {
  let profile = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}/profile?agent=${token}`, { method: 'GET' });
  checkResponse(profile);
  return await profile.json()
}

