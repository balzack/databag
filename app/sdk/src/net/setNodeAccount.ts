import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeAccount(server: string, secure: boolean, token: string, accountId: number, disabled: boolean) {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/accounts/${accountId}/status?token=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(disabled) });
  checkResponse(status);
}
