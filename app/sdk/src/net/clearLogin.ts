import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function clearLogin(node: string, secure: boolean, token: string, all: boolean): Promise<void> {
  const param = all ? '&all=true' : '';
  const endpoint = `http${secure ? 's' : ''}://${node}/account/apps?agent=${token}${param}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'DELETE' });
  checkResponse(status);
}
