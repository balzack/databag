import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(server, token, appName, appVersion, platform, deviceToken, pushType, notifications) {
  let access = await fetchWithTimeout(`https://${server}/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&pushType=${pushType}`, { method: 'PUT', body: JSON.stringify(notifications) })
  checkResponse(access)
  return await access.json()
}

