import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAccount(server, token, accountId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let res = await fetchWithTimeout(`${protocol}://${server}/admin/accounts/${accountId}?token=${token}`, { method: 'DELETE' })
  checkResponse(res);
}

