import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountSearchable(server, token, flag) {
  let res = await fetchWithTimeout(`https://${server}/account/searchable?agent=${token}`, { method: 'PUT', body: JSON.stringify(flag) })
  checkResponse(res);
}

