import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCard(token, message) {
  let card = await fetchWithTimeout(`/contact/cards?agent=${token}`, { method: 'POST', body: JSON.stringify(message)} );
  checkResponse(card);
  return await card.json();
}

