import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(token, appName, appVersion, platform) {
  let app = { Name: "indicom", Description: "decentralized communication" }
  let access = await fetchWithTimeout(`/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}`, { method: 'PUT', body: JSON.stringify(app) })
  checkResponse(access)
  return await access.json()
}

