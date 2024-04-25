import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactCall(server, token, callId) {
  let host = '';
  if (server) {
    host = `https://${server}`;
  }

  const call = await fetchWithTimeout(`${host}/talk/calls/${callId}?contact=${token}`, { method: 'DELETE' });
  checkResponse(call);
}
