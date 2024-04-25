import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeCall(token, callId) {
  let param = '?agent=' + token;
  let call = await fetchWithTimeout(`/talk/calls/${callId}` + param, { method: 'DELETE' });
  checkResponse(call);
}
