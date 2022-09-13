import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeStatus(server) {
  let status = await fetchWithTimeout(`http://${server}/admin/status`, { method: 'GET' });
  checkResponse(status);
  return await status.json();
}

