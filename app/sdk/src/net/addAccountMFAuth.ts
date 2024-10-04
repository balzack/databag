import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function addAccountMFAuth(node: string, secure: boolean, token: string): Promise<{ secretText: string; secretImage: string }> {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/mfauth?agent=${token}`;
  const auth = await fetchWithTimeout(endpoint, { method: "POST" });
  checkResponse(auth.status);
  return await auth.json();
}
