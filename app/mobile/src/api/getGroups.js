import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getGroups(server, token, revision) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let param = "agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let groups = await fetchWithTimeout(`${protocol}://server/alias/groups?${param}`, { method: 'GET' });
  checkResponse(groups)
  return await groups.json()
}


