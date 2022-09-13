import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeStatus(server, token) {
  let status = await fetchWithTimeout(`http://${server}/admin/status?token=${token}`, { method: 'PUT' });
  checkResponse(status);
}

