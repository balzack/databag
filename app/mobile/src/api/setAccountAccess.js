import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(server, token) {
  let app = { Name: "indicom", Description: "decentralized communication" }
  let access = await fetchWithTimeout(`https://${server}/account/access?token=${token}`, { method: 'PUT', body: JSON.stringify(app) })
  checkResponse(access)
  return await access.json()
}

