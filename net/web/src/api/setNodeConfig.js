import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setNodeConfig(password, config) {
  let body = JSON.stringify(config);
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode("admin:" + password));
  let settings = await fetchWithTimeout(`/admin/config`, { method: 'PUT', headers, body });
  checkResponse(settings);
}

