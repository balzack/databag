import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getHandle(server, token, name) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let available = await fetchWithTimeout(`${protocol}://${server}/account/username?agent=${token}&name=${encodeURIComponent(name)}`, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

