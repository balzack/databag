import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListing(server, filter) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  const param = filter ? `?filter=${filter}` : '';
  let listing = await fetchWithTimeout(`${protocol}://${server}/account/listing${param}`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}

