import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactCall(server: string, secure: boolean, guid: string, token: string, callId: string): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${server}/talk/calls/${callId}?contact=${guid}.${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}
