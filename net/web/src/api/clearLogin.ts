import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function clearLogin(token, all) {
  console.log('LOGOUT: ', token, all);

  const param = all ? '&all=true' : '';
  const logout = await fetchWithTimeout(`/account/apps?agent=${token}${param}`, { method: 'DELETE' });
  checkResponse(logout);
}
