import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function keepCall(server, token, callId) {
  let call = await fetchWithTimeout(`https://${server}/talk/calls/${callId}?agent=${token}`, { method: 'PUT' });
  checkResponse(call);
}

