import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardOpenMessage(server, token, cardId) {
  let message = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}/openMessage?agent=${token}`, { method: 'GET' });
  checkResponse(message);
  return await message.json();
}

