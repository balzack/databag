import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeAccounts(server, token) {
  let accounts = await fetchWithTimeout(`https://${server}/admin/accounts?token=${token}`, { method: 'GET' });
  checkResponse(accounts);
  return await accounts.json();
}

