import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setAccountAccess(token) {
  let app = { Name: "indicom", Description: "decentralized communication" }
  let access = await fetchWithTimeout(`/account/access?token=${token}`, { method: 'PUT', body: JSON.stringify(app) })
  checkResponse(access)
  return await access.json()
}

