import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { DataMessage } from "../entities";

export async function getContactListing(
  node: string,
  secure: boolean,
  guid: string
): Promise<DataMessage> {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/listing/${guid}/message`;
  const listing = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(listing.status);
  return await listing.json();
}
