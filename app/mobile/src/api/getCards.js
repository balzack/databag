import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCards(server, token, revision) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let param = "agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let cards = await fetchWithTimeout(`${protocol}://${server}/contact/cards?${param}`, { method: 'GET' });
  checkResponse(cards)
  return await cards.json()
}

