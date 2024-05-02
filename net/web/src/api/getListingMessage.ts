import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListingMessage(server, guid) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  let listing = await fetchWithTimeout(`${host}/account/listing/${guid}/message`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

