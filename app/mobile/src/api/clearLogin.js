import { checkResponse, fetchWithTimeout } from './fetchUtil';
import base64 from 'react-native-base64'

export async function clearLogin(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let logout = await fetchWithTimeout(`${protocol}://${server}/account/apps?agent=${token}`, { method: 'DELETE' })
  checkResponse(logout)
}
