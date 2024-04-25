import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function removeAccount(token, accountId) {
  let res = await fetchWithTimeout(`/admin/accounts/${accountId}?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
  checkResponse(res);
}
