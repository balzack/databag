import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAdminMFAuth(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  const mfa = await fetchWithTimeout(`${protocol}://${server}/admin/mfauth?token=${encodeURIComponent(token)}`, { method: 'GET' });
  checkResponse(mfa);
  return await mfa.json();
}

