import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAdminMFAuth(token) {
  const mfa = await fetchWithTimeout(`/admin/mfauth?token=${token}`, { method: 'POST' })
  checkResponse(mfa);
  return mfa.json();
}

