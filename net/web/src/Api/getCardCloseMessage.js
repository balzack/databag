import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardCloseMessage(token, cardId) {
  let message = await fetchWithTimeout(`/contact/cards/${cardId}/closeMessage?agent=${token}`, { method: 'GET' });
  checkResponse(message);
  return await message.json();
}

