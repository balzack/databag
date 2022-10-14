import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountCreate(server, token) {
  let access = await fetchWithTimeout(`https://${server}/admin/accounts?token=${token}`, { method: 'POST' })
  checkResponse(access);
  return await access.json()
}

