import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { ProfileEntity } from "../entities";

export async function getRegistryListing(handle: string | null, server: string, secure: boolean): Promise<ProfileEntity[]> {
  const param = handle ? `?filter=${handle}` : '';
  const endpoint = `http${secure ? 's' : ''}://${server}/account/listing${param}`
  const listing = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(listing.status);
  return await listing.json();
}

