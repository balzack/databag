import axios from 'redaxios';

export async function addAccountMFAuth(node: string, secure: boolean, token: string): Promise<{ text: string, image: string }> {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/mfauth=${token}`;
  const response = await axios.post(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccountMFAuth failed');
  }
  return response.data;
}

