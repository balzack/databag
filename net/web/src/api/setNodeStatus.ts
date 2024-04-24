import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setNodeStatus(token) {
  let status = await fetchWithTimeout(`/admin/status?token=${encodeURIComponent(token)}`, { method: 'PUT' });
  checkResponse(status);
}

