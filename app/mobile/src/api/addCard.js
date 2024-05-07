import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCard(server, token, message) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let card = await fetchWithTimeout(`${protocol}://${server}/contact/cards?agent=${token}`, { method: 'POST', body: JSON.stringify(message)} );
  checkResponse(card);
  return await card.json();
}

