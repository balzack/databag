import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function clearLogin(server, token) {
  let logout = await fetchWithTimeout(`https://${server}/account/apps?agent=${token}`, { method: 'DELETE' })
  checkResponse(logout)
}
