import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeConfig(server, token, config, updated) {
  let body = JSON.stringify(config);
  let settings = await fetchWithTimeout(`https://${server}/admin/config?token=${token}&domain=${updated}`, { method: 'PUT', body });
  checkResponse(settings);
}

