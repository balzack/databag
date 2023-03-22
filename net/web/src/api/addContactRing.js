import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactRing(server, token, call) {
  let host = "";
  if (server) {
    host = `https://${server}`
  }

  let ring = await fetchWithTimeout(`${host}/talk/ring?contact=${token}`, { method: 'POST', body: JSON.stringify(call) });
  checkResponse(ring);
}

