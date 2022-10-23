import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardProfile(server, token, cardId, message) {
  let profile = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}/profile?agent=${token}`, { method: 'PUT', body: JSON.stringify(message) });
  checkResponse(profile);
  return await profile.json()
}

