import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function removeAccountMFAuth(node: string, secure: boolean, token: string) {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/mfauth?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: "DELETE" });
  checkResponse(status);
}
