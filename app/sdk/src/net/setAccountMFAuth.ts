import axios from 'redaxios';

export async function setAccountMFAuth(node: string, secure: boolean, token: string, code: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/mfauth=${token}`;
  const response = await axios.put(endpoint, code);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccountMFAuth failed');
  }
}

