import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeAccounts(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let accounts = await fetchWithTimeout(`${protocol}://${server}/admin/accounts?token=${token}`, { method: 'GET' });
  checkResponse(accounts);
  return await accounts.json();
}

