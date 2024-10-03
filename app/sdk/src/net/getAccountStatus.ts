import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { ConfigEntity } from "../entities";

export async function getAccountStatus(
  node: string,
  secure: boolean,
  token: string,
): Promise<ConfigEntity> {
  const endpoint = `http${secure ? "s" : ""}://${node}/account/status?agent=${token}`;
  const status = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(status.status);
  return await status.json();
}
