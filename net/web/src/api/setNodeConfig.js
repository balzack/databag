import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeConfig(token, config) {
  let body = JSON.stringify(config);
  let settings = await fetchWithTimeout(`/admin/config?update=open&token=${token}`, { method: 'PUT', body });
  checkResponse(settings);
}

