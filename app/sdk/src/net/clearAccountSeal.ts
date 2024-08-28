import axios from 'redaxios';

export async function setAccountSeal(node: string, secure: boolean, token: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/seal?agent=${token}`;
  const response = await axios.delete(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('setAccountSeal failed');
  }
}

