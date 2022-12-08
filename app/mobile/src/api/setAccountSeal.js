import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountSeal(server, token, seal) {
  let res = await fetchWithTimeout(`https://${server}/account/seal?agent=${token}`, { method: 'PUT', body: JSON.stringify(seal) })
  checkResponse(res);
}

