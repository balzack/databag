import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListingMessage(server, guid) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let listing = await fetchWithTimeout(`${protocol}://${server}/account/listing/${guid}/message`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

