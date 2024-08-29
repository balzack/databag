import axios from 'redaxios';
import { ConfigEntity } from '../entities';

export async function getAccountStatus(node: string, secure: boolean, token: string): Promise<ConfigEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/status?agent=${token}`;
  const response = await axios.get(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('getAccountStatus failed');
  }
  return response.data;
}
