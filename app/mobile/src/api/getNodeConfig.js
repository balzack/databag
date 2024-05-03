import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeConfig(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let config = await fetchWithTimeout(`${protocol}://${server}/admin/config?token=${token}`, { method: 'GET' });
  checkResponse(config);
  return await config.json();
}

