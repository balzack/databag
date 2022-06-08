import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function addAccount(username, password, token) {
  let access = "";
  if (token) {
    access = `?token=${token}`
  }
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let profile = await fetchWithTimeout(`/account/profile${access}`, { method: 'POST', headers: headers })
  checkResponse(profile);
  return await profile.json()
}

