import { checkResponse, fetchWithTimeout } from "./fetchUtil";

export async function removeAccount(node: string, secure: boolean, token: string, cardId: string): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/cards/${cardId}?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: "DELETE" });
  checkResponse(status);
}
