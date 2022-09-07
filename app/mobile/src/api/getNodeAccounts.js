import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeAccounts(token) {
  let accounts = await fetchWithTimeout(`/admin/accounts?token=${token}`, { method: 'GET' });
  checkResponse(accounts);
  return await accounts.json();
}

