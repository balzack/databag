import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function setLogin(username, server, password, appName, appVersion, platform, deviceToken, notifications) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let types = encodeURIComponent(JSON.stringify(notifications));
  let app = { Name: "topics", Description: "decentralized communication" }
  let login = await fetchWithTimeout(`https://${server}/account/apps?appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&notifications=${types}`, { method: 'POST', body: JSON.stringify(app), headers: headers })
  checkResponse(login)
  return await login.json()
}
