import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactCall(server, token, callId) {
  const call = await fetchWithTimeout(`https://${server}/talk/calls/${callId}?contact=${token}`, { method: 'DELETE' });
  checkResponse(call);
}
