import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeStatus() {
  let status = await fetchWithTimeout(`/admin/status`, { method: 'GET' });
  checkResponse(status);
  return await status.json();
}
