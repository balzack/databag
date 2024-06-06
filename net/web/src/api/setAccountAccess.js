import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(token, appName, appVersion, platform, notifications) {
  let access = await fetchWithTimeout(`/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}`, { method: 'PUT', body: JSON.stringify(notifications) })
  checkResponse(access)
  return await access.json()
}

