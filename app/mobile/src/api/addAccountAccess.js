import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountAccess(server, token, accountId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let access = await fetchWithTimeout(`${protocol}://${server}/admin/accounts/${accountId}/auth?token=${token}`, { method: 'POST' })
  checkResponse(access);
  return await access.json()
}

