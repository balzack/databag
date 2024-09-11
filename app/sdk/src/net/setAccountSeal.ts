import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { SealEntity } from '../entities';

export async function setAccountSeal(node: string, secure: boolean, token: string, seal: SealEntity) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/seal?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(seal) });
  checkResponse(status);
}

