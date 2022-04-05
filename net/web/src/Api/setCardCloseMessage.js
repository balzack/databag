import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardCloseMessage(server, message) {
  let status = await fetchWithTimeout(`https://${server}/contact/closeMessage`, { method: 'PUT', body: JSON.stringify(message) });
  checkResponse(status);
  return await status.json();
}

