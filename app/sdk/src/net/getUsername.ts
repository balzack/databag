import axios from 'redaxios';

export async function getUsername(name: string, token: string, node: string, secure: boolean): Promise<boolean> {
  const param = token ? `&token=${token}` : '';
  const username = encodeURIComponent(name)
  const endpoint = `http${secure ? 's' : ''}://${node}/account/username?name=${username}${param}`;
  const response = await axios.get(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('getAvailable fetch failed');
  }
  if (typeof response.data !== 'boolean') {
    throw new Error('getAvailable response failed');
  }
  return response.data;
}

