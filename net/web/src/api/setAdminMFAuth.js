import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAdminMFAuth(token, code) {
  const mfa = await fetchWithTimeout(`/admin/mfauth?token=${token}&code=${code}`, { method: 'PUT' })
  checkResponse(mfa);
}

