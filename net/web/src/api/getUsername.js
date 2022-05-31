import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getUsername(name) {
  let available = await fetchWithTimeout('/account/username?name=' + encodeURIComponent(name), { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

