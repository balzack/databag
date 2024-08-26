import axios from 'redaxios';
import { ProfileEntity } from '../entities';

export async function getProfile(node: string, secure: boolean, token: string): Promise<ProfileEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/profile?agent=${token}`;
  const response = await axios.get(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('getProfile failed');
  }
  return response.data;
}

