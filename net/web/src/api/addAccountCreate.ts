import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountCreate(token) {
  let access = await fetchWithTimeout(`/admin/accounts?token=${encodeURIComponent(token)}`, { method: 'POST' });
  checkResponse(access);
  return await access.json();
}
