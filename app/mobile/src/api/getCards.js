import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCards(token, revision) {
  let param = "agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let cards = await fetchWithTimeout(`/contact/cards?${param}`, { method: 'GET' });
  checkResponse(cards)
  return await cards.json()
}

