import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function keepCall(token, callId) {
  let param = "?agent=" + token
  let call = await fetchWithTimeout(`/talk/calls/${callId}` + param, { method: 'PUT' });
  checkResponse(call)
}

