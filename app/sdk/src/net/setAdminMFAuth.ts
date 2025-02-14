import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAdminMFAuth(server: string, secure: boolean, token: string, code: string): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/mfauth?token=${token}&code=${code}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT' });
  checkResponse(status);
}

