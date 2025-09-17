import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function setLogin(username, server, password, code, appName, appVersion, platform, deviceToken, notifications) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  const mfa = code ? `&code=${code}` : '';

  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let login = await fetchWithTimeout(`${protocol}://${server}/account/apps?appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&pushType=up${mfa}`, { method: 'POST', body: JSON.stringify(notifications), headers: headers })
  checkResponse(login)
  return await login.json()
}
