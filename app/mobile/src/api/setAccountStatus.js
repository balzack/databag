import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountStatus(server, token, accountId, disabled) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let res = await fetchWithTimeout(`${protocol}://${server}/admin/accounts/${accountId}/status?token=${token}`, { method: 'PUT', body: JSON.stringify(disabled) })
  checkResponse(res);
}

