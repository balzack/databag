import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeConfig(server, token, config) {
  let body = JSON.stringify(config);
  let settings = await fetchWithTimeout(`https://${server}/admin/config?token=${token}`, { method: 'PUT', body });
  checkResponse(settings);
}

