import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getCardCloseMessage(node: string, secure: boolean): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/closeMessage`;
  const close = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(close.status);
}

