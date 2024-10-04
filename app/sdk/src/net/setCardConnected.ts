import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function setCardConnected(node: string, secure: boolean, token: string, cardId: string, access: string, article: number, channel: number, profile: number): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/cards/${cardId}/status?agent=${token}&token=${access}&viewRevision=1&articleRevision=${article}&channelRevision=${channel}&profileRevision=${profile}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: "PUT",
    body: JSON.stringify("connecting"),
  });
  checkResponse(status);
}
