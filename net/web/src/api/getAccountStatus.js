import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAccountStatus(token) {
  let status = await fetchWithTimeout('/account/status?agent=' + token, { method: 'GET' });
  checkResponse(status);
  return await status.json()
}

