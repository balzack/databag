import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardCloseMessage(node: string, secure: boolean, message: string): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/closeMessage`;
  const close = await fetchWithTimeout(endpoint, { method: "PUT", JSON.stringify(message) });
  checkResponse(close.status);
}

