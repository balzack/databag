import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAccountStatus(server, token) {
  let status = await fetchWithTimeout(`https://${server}/account/status?agent=${token}`, { method: 'GET' });
  checkResponse(status);
  return await status.json()
}

