import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setAccountLogin(token, username, password) {
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let res = await fetchWithTimeout(`/account/login?agent=${token}`, { method: 'PUT', headers })
  checkResponse(res);
}

