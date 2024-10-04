import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { CardDetailEntity } from "../entities";

export async function getCardDetail(node: string, secure: boolean, token: string, cardId: string): Promise<CardDetailEntity> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/cards/${cardId}/detail?agent=${token}`;
  const detail = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(detail.status);
  return await detail.json();
}
