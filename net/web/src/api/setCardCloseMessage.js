import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardCloseMessage(server, message) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let status = await fetchWithTimeout(`${host}/contact/closeMessage`, { method: 'PUT', body: JSON.stringify(message) });
  checkResponse(status);
  return await status.json();
}

