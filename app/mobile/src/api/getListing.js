import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListing(server, filter) {
  const param = filter ? `?filter=${filter}` : '';
  let listing = await fetchWithTimeout(`https://${server}/account/listing${param}`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

