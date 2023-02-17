import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getNodeStatus(server) {
  let status = await fetchWithTimeout(`https://${server}/admin/status`, { method: 'GET' });
  checkResponse(status);
  return await status.json();
}

