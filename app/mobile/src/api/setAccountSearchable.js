import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountSearchable(server, token, flag) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let res = await fetchWithTimeout(`${protocol}://${server}/account/searchable?agent=${token}`, { method: 'PUT', body: JSON.stringify(flag) })
  checkResponse(res);
}

