import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getUsername(name, token) {
  let access = "";
  if (token) {
    access = `&token=${token}`
  }
  let available = await fetchWithTimeout('/account/username?name=' + encodeURIComponent(name) + access, { method: 'GET' })
  checkResponse(available)
  return await available.json()
}

