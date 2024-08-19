import axios from 'redaxios';

export async function clearLogin(node: string, secure: boolean, token: string, all: boolean): Promise<void> {
  const param = all ? '&all=true' : ''
  const endpoint = `http${secure ? 's' : ''}://${node}/account/apps?agent=${token}${param}`;
  const response = await axios.delete(endpoint);
  if (response.status >= 400 && response.status < 600) {
    throw new Error('clearLogin failed');
  }
}

