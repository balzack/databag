import { checkResponse, fetchWithCustomTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function addAccount(username, password, token) {
  let access = "";
  if (token) {
    access = `?token=${token}`
  }
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let profile = await fetchWithCustomTimeout(`/account/profile${access}`, { method: 'POST', headers: headers }, 60000)
  checkResponse(profile);
  return await profile.json()
}

