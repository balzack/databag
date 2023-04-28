import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeStatus(server, token) {
  let status = await fetchWithTimeout(`https://${server}/admin/status?token=${token}`, { method: 'PUT' });
  checkResponse(status);
}

