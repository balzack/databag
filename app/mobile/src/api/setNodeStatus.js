import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeStatus(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let status = await fetchWithTimeout(`${protocol}://${server}/admin/status?token=${token}`, { method: 'PUT' });
  checkResponse(status);
}

