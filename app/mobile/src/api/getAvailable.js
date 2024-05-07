import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAvailable(server) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let available = await fetchWithTimeout(`${protocol}://${server}/account/available`, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

