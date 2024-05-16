import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAccountMFA(token) {
  let res = await fetchWithTimeout(`/account/mfauth?agent=${token}`, { method: 'DELETE' })
  checkResponse(res);
}

