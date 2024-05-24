import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAdminMFAuth(token) {
  const mfa = await fetchWithTimeout(`/admin/mfauth?token=${encodeURIComponent(token)}`, { method: 'GET' });
  checkResponse(mfa);
  return await mfa.json();
}

