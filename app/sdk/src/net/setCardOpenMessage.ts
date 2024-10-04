import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardOpenMessage(node: string, secure: boolean, message: string): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/openMessage`;
  const open = await fetchWithTimeout(endpoint, { method: "PUT", JSON.stringify(message) });
  checkResponse(open.status);
}

