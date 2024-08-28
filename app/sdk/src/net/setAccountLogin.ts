import axios from 'redaxios';
import { encode } from './base64';

export async function setAccountLogin(node: string, secure: boolean, token: string, username: string, password: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/login?agent=${token}`;
  const auth = encode(`${username}:${password}`);
  const response = await axios.put(endpoint, null, { auth: `Basic ${auth}` });
  return response.data;
}
