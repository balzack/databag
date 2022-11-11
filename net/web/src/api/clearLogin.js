import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function clearLogin(token) {
  let logout = await fetchWithTimeout(`/account/apps?agent=${token}`, { method: 'DELETE' })
  checkResponse(logout)
}


