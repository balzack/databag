import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeCard(server, token, cardId) {
  let card = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}?agent=${token}`, { method: 'DELETE' } );
  checkResponse(card);
  return await card.json();
}

