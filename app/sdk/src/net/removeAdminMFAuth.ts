import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAdminMFAuth(server: string, secure: boolean, token: string) {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/mfauth?token=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}

