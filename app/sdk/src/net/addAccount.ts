import axios from 'redaxios';
import { encode } from './base64';

export async function addAccount(url: string, username: string, password: string, token: string | null): Promise<void> {
  const access = token ? `?token=${token}` : ''
  const endpoint = `${url}/account/profile${access}`
  const auth = encode(`${username}:${password}`)

  const response = await Promise.race<{ status: number }>([
    axios.post(endpoint, null, { headers: { 'Credentials' : `Basic ${auth}` } }).catch(err => { throw new Error('addAccount failed') }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('addAccount timeout')), 60000))
  ]);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('addAccount failed');
  }
}
