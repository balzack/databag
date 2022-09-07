import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeStatus(token) {
  let status = await fetchWithTimeout(`/admin/status?token=${token}`, { method: 'PUT' });
  checkResponse(status);
}

