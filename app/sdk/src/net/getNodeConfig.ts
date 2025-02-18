import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { SetupEntity } from '../entities';

export async function getNodeConfig(server: string, secure: boolean, token: string): Promise<ConfigEntity> {
  const endpoint = `http${secure ? 's' : ''}://${server}/admin/config?token=${token}`;
  const config = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(config.status);
  return await config.json();
}

