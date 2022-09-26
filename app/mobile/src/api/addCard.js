import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCard(server, token, message) {
  let card = await fetchWithTimeout(`https://${server}/contact/cards?agent=${token}`, { method: 'POST', body: JSON.stringify(message)} );
  checkResponse(card);
  return await card.json();
}

