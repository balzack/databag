import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCall(server, token, cardId) {
  let call = await fetchWithTimeout(`https://${server}/talk/calls?agent=${token}`, { method: 'POST', body: JSON.stringify(cardId)} );
  checkResponse(call);
  return await call.json();
}

