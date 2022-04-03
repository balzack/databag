var base64 = require('base-64');

const FETCH_TIMEOUT = 15000;

function checkResponse(response) {
  if(response.status >= 400 && response.status < 600) {
    throw new Error(response.url + " failed");
  }
}

export function getProfileImageUrl(token, revision) {
  return '/profile/image?agent=' + token + "&revision=" + revision
}

export function getCardImageUrl(token, cardId, revision) {
  return `/contact/cards/${cardId}/profile/image?agent=${token}&revision=${revision}`
}

export function getListingImageUrl(server, guid, revision) {
  return `https://${server}/account/listing/${guid}/image?revision=${revision}`
}

async function fetchWithTimeout(url, options) {
  return Promise.race([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), FETCH_TIMEOUT))
  ]);
}

export async function getAvailable() {
  let available = await fetchWithTimeout("/account/available", { method: 'GET', timeout: FETCH_TIMEOUT })
  checkResponse(available)
  return await available.json()
}

export async function getUsername(name) {
  let available = await fetchWithTimeout('/account/username?name=' + encodeURIComponent(name), { method: 'GET', timeout: FETCH_TIMEOUT })
  checkResponse(available)
  return await available.json()
}

export async function setLogin(username, password) {
  let headers = new Headers()
  headers.append('Authorization', 'Basic ' + base64.encode(username + ":" + password));
  let app = { Name: "indicom", Description: "decentralized communication" }
  let login = await fetchWithTimeout('/account/apps', { method: 'POST', timeout: FETCH_TIMEOUT, body: JSON.stringify(app), headers: headers })
  checkResponse(login)
  return await login.json()
}

export async function setAccountSearchable(token, flag) {
  let res = await fetchWithTimeout('/account/searchable?agent=' + token, { method: 'PUT', body: JSON.stringify(flag), timeout: FETCH_TIMEOUT })
  checkResponse(res);
}

export async function getAccountStatus(token) {
  let status = await fetchWithTimeout('/account/status?agent=' + token, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(status);
  return await status.json()
} 

export async function createAccount(username, password) {
  let headers = new Headers()
  headers.append('Credentials', 'Basic ' + base64.encode(username + ":" + password));
  let profile = await fetchWithTimeout("/account/profile", { method: 'POST', timeout: FETCH_TIMEOUT, headers: headers })
  checkResponse(profile);
  return await profile.json()
}

export async function getProfile(token) {
  let profile = await fetchWithTimeout('/profile?agent=' + token, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(profile)
  return await profile.json()
}

export async function setProfileData(token, name, location, description) {
  let data = { name: name, location: location, description: description };
  let profile = await fetchWithTimeout('/profile/data?agent=' + token, { method: 'PUT', body: JSON.stringify(data), timeout: FETCH_TIMEOUT });
  checkResponse(profile)
  return await profile.json()
}

export async function setProfileImage(token, image) {
  let profile = await fetchWithTimeout('/profile/image?agent=' + token, { method: 'PUT', body: JSON.stringify(image), timeout: FETCH_TIMEOUT });
  checkResponse(profile)
  return await profile.json()
}

export async function getGroups(token, revision) {
  let param = "?agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let groups = await fetchWithTimeout('/alias/groups' + param, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(groups)
  return await groups.json()
}

export async function getListing(server) {
  let listing = await fetchWithTimeout(`https://${server}/account/listing`, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(listing);
  return await listing.json();
}

export async function getCards(token, revision) {
  let param = "?agent=" + token
  if (revision != null) {
    param += '&revision=' + revision
  }
  let cards = await fetchWithTimeout('/contact/cards' + param, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(cards)
  return await cards.json()
}

export async function getCardProfile(token, cardId) {
  let param = "?agent=" + token
  let profile = await fetchWithTimeout(`/contact/cards/${cardId}/profile${param}`, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(profile);
  return await profile.json()
}

export async function getCardDetail(token, cardId) {
  let param = "?agent=" + token
  let detail = await fetchWithTimeout(`/contact/cards/${cardId}/detail${param}`, { method: 'GET', timeout: FETCH_TIMEOUT });
  checkResponse(detail);
  return await detail.json()
}

