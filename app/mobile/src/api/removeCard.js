import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeCard(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let card = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}?agent=${token}`, { method: 'DELETE' } );
  checkResponse(card);
  return await card.json();
}

