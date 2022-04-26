import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardOpenMessage(server, message) {
  let status = await fetchWithTimeout(`https://${server}/contact/openMessage`, { method: 'PUT', body: JSON.stringify(message) });
  checkResponse(status);
  return await status.json();
}

