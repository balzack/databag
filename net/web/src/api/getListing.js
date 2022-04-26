import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListing(server) {
  let listing = await fetchWithTimeout(`https://${server}/account/listing`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

