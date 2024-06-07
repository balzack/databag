import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountNotifications(token, webEndpoint, webPublicKey, webAuth, flag) {
  const endpointEnc = encodeURIComponent(webEndpoint);
  const publicKeyEnc = encodeURIComponent(webPublicKey);
  const authEnc = encodeURIComponent(webAuth);
  let res = await fetchWithTimeout(`/account/notification?agent=${token}&webEndpoint=${endpointEnc}&webPublicKey=${publicKeyEnc}&webAuth=${authEnc}&pushType=web`, { method: 'PUT', body: JSON.stringify(flag) })
  checkResponse(res);
}

