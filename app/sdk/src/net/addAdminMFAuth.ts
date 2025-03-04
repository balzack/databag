import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAdminMFAuth(server: string, secure: boolean, token: string): Promise<{ secretImage: string, secretText: string }> {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/mfauth?token=${token}`;
  const mfa = await fetchWithTimeout(endpoint, { method: 'POST' });
  checkResponse(mfa.status);
  return await mfa.json();
}

