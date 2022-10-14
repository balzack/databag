import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountStatus(server, token, accountId, disabled) {
  let res = await fetchWithTimeout(`https://${server}/admin/accounts/${accountId}/status?token=${token}`, { method: 'PUT', body: JSON.stringify(disabled) })
  checkResponse(res);
}

