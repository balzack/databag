import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getListing(server, filter) {
  const host = server ? `https://${server}` : '';
  const param = filter ? `?filter=${filter}` : '';

  let listing = await fetchWithTimeout(`${host}/account/listing${param}`, { method: 'GET' });
  checkResponse(listing);
  return await listing.json();
}
