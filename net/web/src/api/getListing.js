import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListing(server) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let listing = await fetchWithTimeout(`${host}/account/listing`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

