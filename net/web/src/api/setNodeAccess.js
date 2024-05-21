import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeAccess(token, code) {
  const mfa = code ? `&code=${code}` : '';
  const access = await fetchWithTimeout(`/admin/access?token=${encodeURIComponent(token)}${mfa}`, { method: 'PUT' });
  checkResponse(access);
  return access.json()
}

