import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountSeal(token, seal) {
  let res = await fetchWithTimeout('/account/seal?agent=' + token, { method: 'PUT', body: JSON.stringify(seal) });
  checkResponse(res);
}
