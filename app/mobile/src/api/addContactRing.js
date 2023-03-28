import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactRing(server, token, call) {
  let ring = await fetchWithTimeout(`https://${server}/talk/rings?contact=${token}`, { method: 'POST', body: JSON.stringify(call) });
  checkResponse(ring);
}

