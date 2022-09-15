import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCards(server, token, revision) {
  let param = "agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let cards = await fetchWithTimeout(`https://${server}/contact/cards?${param}`, { method: 'GET' });
  checkResponse(cards)
  return await cards.json()
}

