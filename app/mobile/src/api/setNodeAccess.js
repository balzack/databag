import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeAccess(server, token, code) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  const mfa = code ? `&code=${code}` : '';

  const access = await fetchWithTimeout(`${protocol}://${server}/admin/access?token=${encodeURIComponent(token)}${mfa}`, { method: 'PUT' });
  checkResponse(access);
  return access.json()
}

