import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { SetupEntity } from '../entities';

export async function setNodeConfig(server: string, secure: boolean, token: string, config: SetupEntity) {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/config?token=${token}&setOpenAccess=true`;
  const { status }= await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(config) });
  checkResponse(status);
}

