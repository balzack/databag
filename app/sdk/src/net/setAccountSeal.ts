import axios from 'redaxios';
import { SealEntity } from '../entities';

export async function setAccountSeal(node: string, secure: boolean, token: string, seal: SealEntity) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/seal?agent=${token}`;
  const response = await axios.put(endpoint, seal);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccountSeal failed');
  }
}

