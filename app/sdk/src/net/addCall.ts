import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { Calling } from '../entities';

export async function addCall(node: string, secure: boolean, token: string, cardId: string): Promise<Calling> {
  const endpoint = `http${secure ? 's' : ''}://${node}/talk/calls?agent=${token}`;
  const call = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(cardId) });
  checkResponse(call.status);
  return await call.json();
}

