import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addCall(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let call = await fetchWithTimeout(`${protocol}://${server}/talk/calls?agent=${token}`, { method: 'POST', body: JSON.stringify(cardId)} );
  checkResponse(call);
  return await call.json();
}

