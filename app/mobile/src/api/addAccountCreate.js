import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addAccountCreate(server, token) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let access = await fetchWithTimeout(`${protocol}://${server}/admin/accounts?token=${token}`, { method: 'POST' })
  checkResponse(access);
  return await access.json()
}

