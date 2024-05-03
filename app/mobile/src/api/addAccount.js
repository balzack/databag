import { checkResponse, fetchWithCustomTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function addAccount(server, username, password, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let access = "";
  if (token) {
    access = `?token=${token}`
  }
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let profile = await fetchWithCustomTimeout(`${protocol}://${server}/account/profile${access}`, { method: 'POST', headers: headers }, 60000)
  checkResponse(profile);
  return await profile.json()
}

