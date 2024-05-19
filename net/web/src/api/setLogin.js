import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setLogin(username, password, code, appName, appVersion, userAgent) {
  const platform = encodeURIComponent(userAgent);
  const mfa = code ? `&code=${code}` : '';
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let login = await fetchWithTimeout(`/account/apps?appName=${appName}&appVersion=${appVersion}&platform=${platform}${mfa}`, { method: 'POST', body: JSON.stringify([]), headers: headers })
  checkResponse(login)
  return await login.json()
}
