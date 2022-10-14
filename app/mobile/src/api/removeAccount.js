import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAccount(server, token, accountId) {
  let res = await fetchWithTimeout(`https://${server}/admin/accounts/${accountId}?token=${token}`, { method: 'DELETE' })
  checkResponse(res);
}

