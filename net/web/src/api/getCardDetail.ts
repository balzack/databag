import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardDetail(token, cardId) {
  let param = '?agent=' + token;
  let detail = await fetchWithTimeout(`/contact/cards/${cardId}/detail${param}`, { method: 'GET' });
  checkResponse(detail);
  return await detail.json();
}
