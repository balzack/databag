import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function setAccountLogin(server, token, username, password) {
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let res = await fetchWithTimeout(`https://${server}/account/login?agent=${token}`, { method: 'PUT', headers })
  checkResponse(res);
}

