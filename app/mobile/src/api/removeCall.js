import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeCall(server, token, callId) {
  let call = await fetchWithTimeout(`https://${server}/talk/calls/${callId}?agent=${token}`, { method: 'DELETE' });
  checkResponse(call)
}

