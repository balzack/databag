import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountStatus(token, accountId, disabled) {
  let res = await fetchWithTimeout(`/admin/accounts/${accountId}/status?token=${encodeURIComponent(token)}`, {
    method: 'PUT',
    body: JSON.stringify(disabled),
  });
  checkResponse(res);
}
