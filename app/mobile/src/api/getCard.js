import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCard(server, token, cardId) {
  let param = "?agent=" + token
  let card = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}${param}`, { method: 'GET' });
  checkResponse(card);
  return await card.json()
}

