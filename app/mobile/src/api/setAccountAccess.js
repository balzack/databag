import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(server, token, notifications) {
  let app = { Name: "indicom", Description: "decentralized communication" }
  let types = encodeURIComponent(JSON.stringify(notifications));
  let access = await fetchWithTimeout(`https://${server}/account/access?token=${token}&appName=${appName}&appVersion=${appVersion}&platform=${platform}&deviceToken=${deviceToken}&notifications=${types}`, { method: 'PUT', body: JSON.stringify(app) })
  checkResponse(access)
  return await access.json()
}

