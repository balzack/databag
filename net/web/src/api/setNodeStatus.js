import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setNodeStatus(password) {
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode("admin:" + password));
  let status = await fetchWithTimeout(`/admin/status`, { method: 'PUT', headers });
  checkResponse(status);
}

