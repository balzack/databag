import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getAvailable() {
  let available = await fetchWithTimeout('/account/available', { method: 'GET' });
  checkResponse(available);
  return await available.json();
}
