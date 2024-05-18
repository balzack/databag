import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountMFA(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  const mfa = await fetchWithTimeout(`${protocol}://${server}/account/mfauth?agent=${token}`, { method: 'POST' })
  checkResponse(mfa);
  return mfa.json();
}

