import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { PushParams } from '../types';

export async function setAccountNotifications(node: string, secure: boolean, token: string, flag: boolean, pushParams?: PushParams) {
  const pushEndpoint = pushParams ? encodeURIComponent(pushParams.endpoint) : '';
  const publicKey = pushParams ? encodeURIComponent(pushParams.publicKey) : '';
  const auth = pushParams ? encodeURIComponent(pushParams.auth) : '';
  const params = pushParams ? `&webEndpoint=${pushEndpoint}&webPublicKey=${publicKey}&webAuth=${auth}&pushType=${pushParams.type}` : ''
  const endpoint = `http${secure ? 's' : ''}://${node}/account/notification?agent=${token}${params}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: 'PUT',
    body: JSON.stringify(flag),
  });
  checkResponse(status);
}
