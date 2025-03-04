import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeNodeAccount(server: string, secure: boolean, token: string, accountId: number) {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/accounts/${accountId}?token=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}
