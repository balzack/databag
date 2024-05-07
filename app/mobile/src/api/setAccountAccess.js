import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(server, token, appName, appVersion, platform, deviceToken, notifications) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let access = await fetchWithTimeout(`${protocol}://${server}/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&pushType=up`, { method: 'PUT', body: JSON.stringify(notifications) })
  checkResponse(access)
  return await access.json()
}

