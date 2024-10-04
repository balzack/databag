import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function setAccountMFAuth(node: string, secure: boolean, token: string, code: string) {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/mfauth?agent=${token}&code=${code}`;
  const { status } = await fetchWithTimeout(endpoint, { method: "PUT" });
  checkResponse(status);
}
