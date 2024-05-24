import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAdminMFAuth(token) {
  const mfa = await fetchWithTimeout(`/admin/mfauth?token=${token}`, { method: 'DELETE' })
  checkResponse(mfa);
}

