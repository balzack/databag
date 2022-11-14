import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountNotifications(server, token, flag) {
  let res = await fetchWithTimeout(`https://${server}/account/notification?agent=${token}`, { method: 'PUT', body: JSON.stringify(flag) })
  checkResponse(res);
}

