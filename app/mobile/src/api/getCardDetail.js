import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardDetail(server, token, cardId) {
  let param = "?agent=" + token
  let detail = await fetchWithTimeout(`https://${server}/contact/cards/${cardId}/detail${param}`, { method: 'GET' });
  checkResponse(detail);
  return await detail.json()
}

