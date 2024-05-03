import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactRing(server, token, call) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let ring = await fetchWithTimeout(`${protocol}://${server}/talk/rings?contact=${token}`, { method: 'POST', body: JSON.stringify(call) });
  checkResponse(ring);
}

