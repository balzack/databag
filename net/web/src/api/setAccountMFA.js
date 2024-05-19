import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountMFA(token, code) {
  let res = await fetchWithTimeout(`/account/mfauth?agent=${token}&code=${code}`, { method: 'PUT' })
  checkResponse(res);
}

