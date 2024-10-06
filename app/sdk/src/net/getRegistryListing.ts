import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ProfileEntity } from "../entities";

export async function getRegistryListing(server: string, secure: boolean, filter: string): Promise<ProfileEntity[]> {
  const param = filter ? `?filter=${filter}` : '';
  const endpoint = `http${secure ? 's' : ''}://${server}/account/listing${filter}`
  const listing = fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(listing.status);
  return await listing.json();
}


