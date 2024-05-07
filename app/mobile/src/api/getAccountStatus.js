import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAccountStatus(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let status = await fetchWithTimeout(`${protocol}://${server}/account/status?agent=${token}`, { method: 'GET' });
  checkResponse(status);
  return await status.json()
}

