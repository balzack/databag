import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeAccess(token) {
  const access = await fetchWithTimeout(`/admin/access?token=${encodeURIComponent(token)}`, { method: 'PUT' });
  checkResponse(access);
  return access.json()
}

