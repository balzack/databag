import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAvailable(server) {
  let available = await fetchWithTimeout(`https://${server}/account/available`, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

