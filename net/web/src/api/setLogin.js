import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setLogin(username, password) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let app = { Name: "indicom", Description: "decentralized communication" }
  let login = await fetchWithTimeout('/account/apps', { method: 'POST', body: JSON.stringify(app), headers: headers })
  checkResponse(login)
  return await login.json()
}
