import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function setLogin(username, server, password) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let app = { Name: "topics", Description: "decentralized communication" }
  let login = await fetchWithTimeout(`https://${server}/account/apps`, { method: 'POST', body: JSON.stringify(app), headers: headers })
  checkResponse(login)
  return await login.json()
}
