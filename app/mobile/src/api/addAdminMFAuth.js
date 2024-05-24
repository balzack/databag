import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAdminMFAuth(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  const mfa = await fetchWithTimeout(`${protocol}://${server}/admin/mfauth?token=${token}`, { method: 'POST' })
  checkResponse(mfa);
  return mfa.json();
}

