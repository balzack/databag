import axios from 'redaxios';

export async function getAvailable(node: string, secure: boolean): number {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/available`;
  const response = await axios.get(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('getAvailable fetch failed');
  }
  if (typeof response.data !== 'number') {
    throw new Error('getAvailable response failed');
  }
  return response.data;
}

