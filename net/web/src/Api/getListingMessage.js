import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListingMessage(server, guid) {
  let listing = await fetchWithTimeout(`https://${server}/account/listing/${guid}/message`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

