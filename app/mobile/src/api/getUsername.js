import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getUsername(name, server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let query = "";
  if (token && name) {
    query = `?name=${encodeURIComponent(name)}&token=${token}`;
  }
  else if (!token && name) {
    query = `?name=${encodeURIComponent(name)}`
  }
  else if (token && !name) {
    query = `?token=${token}`;
  }
    
  let available = await fetchWithTimeout(`${protocol}://${server}/account/username${query}`, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

