import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardCloseMessage(server, token, cardId) {
  let message = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}/closeMessage?agent=${token}`, { method: 'GET' });
  checkResponse(message);
  return await message.json();
}

