import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function getNodeConfig(password) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode("admin:" + password));
  let config = await fetchWithTimeout(`/admin/config`, { method: 'GET', headers });
  checkResponse(config);
  return await config.json();
}

