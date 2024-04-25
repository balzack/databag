import { checkResponse, fetchWithTimeout } from './fetchUtil';
var base64 = require('base-64');

export async function setLogin(username, password, appName, appVersion, userAgent) {
  const platform = encodeURIComponent(userAgent);
  let headers = new Headers();
  headers.append('Authorization', 'Basic ' + base64.encode(username + ':' + password));
  let login = await fetchWithTimeout(`/account/apps?appName=${appName}&appVersion=${appVersion}&platform=${platform}`, {
    method: 'POST',
    body: JSON.stringify([]),
    headers: headers,
  });
  checkResponse(login);
  return await login.json();
}
