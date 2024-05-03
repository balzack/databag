import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardDetail(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let param = "?agent=" + token
  let detail = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}/detail${param}`, { method: 'GET' });
  checkResponse(detail);
  return await detail.json()
}

