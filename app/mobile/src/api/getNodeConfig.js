import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeConfig(server, token) {
  let config = await fetchWithTimeout(`https://${server}/admin/config?token=${token}`, { method: 'GET' });
  checkResponse(config);
  return await config.json();
}

