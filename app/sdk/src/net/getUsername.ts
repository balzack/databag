import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function getUsername(name: string, token: string | null, agent: string | null, node: string, secure: boolean): Promise<boolean> {
  const param = token ? `&token=${token}` : agent ? `&agent=${agent}` : "";
  const username = encodeURIComponent(name);
  const endpoint = `http${secure ? "s" : ""}://${node}/account/username?name=${username}${param}`;
  const taken = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(taken.status);
  return await taken.json();
}
