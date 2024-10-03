import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function getAvailable(
  node: string,
  secure: boolean,
): Promise<number> {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/available`;
  const available = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(available.status);
  return await available.json();
}
