import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { encode } from './base64';

export async function setAccountLogin(node: string, secure: boolean, token: string, username: string, password: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/login?agent=${token}`;
  const auth = encode(`${username}:${password}`);
  const headers = new Headers()
  headers.append('Credentials', `Basic ${auth}`);
  checkResponse(await fetchWithTimeout(endpoint, { method: 'PUT', headers }));
}
