import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountAccess(server, token, accountId) {
  let access = await fetchWithTimeout(`https://${server}/admin/accounts/${accountId}/auth?token=${token}`, { method: 'POST' })
  checkResponse(access);
  return await access.json()
}

