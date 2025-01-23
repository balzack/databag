import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { Ringing } from '../entities';

export async function addContactRing(server: string, secure: boolean, token: string, ringing: Ringing):  {
  const endpoint = `http${secure ? 's' : '' }://${server}/talk/rings/?contact=${token}';
  const { status } = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(ringing) });
  checkResponse(status);
}

