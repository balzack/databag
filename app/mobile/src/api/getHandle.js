import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getHandle(server, token, name) {
  let available = await fetchWithTimeout(`https://${server}/account/username?agent=${token}&name=${encodeURIComponent(name)}`, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

