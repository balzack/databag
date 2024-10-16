import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { DataMessage } from '../entities';

export async function setCardCloseMessage(node: string, secure: boolean, message: DataMessage): Promise<void> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/closeMessage`;
  const close = await fetchWithTimeout(endpoint, { method: "PUT", body: JSON.stringify(message) });
  checkResponse(close.status);
}
