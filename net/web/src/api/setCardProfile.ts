import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardProfile(token, cardId, message) {
  let profile = await fetchWithTimeout(`/contact/cards/${cardId}/profile?agent=${token}`, {
    method: 'PUT',
    body: JSON.stringify(message),
  });
  checkResponse(profile);
  return await profile.json();
}
