import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { ChannelSummaryEntity } from "../entities";

export async function getContactChannelSummary(
  server: string,
  secure: boolean,
  token: string,
  channelId: string,
): Promise<ChannelSummaryEntity> {
  const endpoint = `http${secure ? "s" : ""}://${node}/content/channels/${channelId}/summary?contact=${guid}.${token}`;
  const summary = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(summary.status);
  return await summary.json();
}
