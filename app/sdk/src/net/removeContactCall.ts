import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeContactCall(server: string, secure: boolean, token: string, callId: string): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${server}/talk/calls/${callId}?contact=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}
