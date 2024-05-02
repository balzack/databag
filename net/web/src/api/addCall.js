import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCall(token, cardId) {
  let param = "?agent=" + token
  let call = await fetchWithTimeout('/talk/calls' + param, { method: 'POST', body: JSON.stringify(cardId) });
  checkResponse(call)
  let ret = await call.json()
  return ret;
}

