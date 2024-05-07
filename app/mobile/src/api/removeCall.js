import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeCall(server, token, callId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let call = await fetchWithTimeout(`${protocol}://${server}/talk/calls/${callId}?agent=${token}`, { method: 'DELETE' });
  checkResponse(call)
}

