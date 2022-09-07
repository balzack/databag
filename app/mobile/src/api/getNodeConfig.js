import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeConfig(token) {
  let config = await fetchWithTimeout(`/admin/config?token=${token}`, { method: 'GET' });
  checkResponse(config);
  return await config.json();
}

