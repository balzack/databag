import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountMFA(token) {
  const mfa = await fetchWithTimeout(`/account/mfauth?agent=${token}`, { method: 'POST' })
  checkResponse(mfa);
  return mfa.json();
}

