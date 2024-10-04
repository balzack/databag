import { checkResponse, fetchWithTimeout } from "./fetchUtil";
import { CardEntity } from "../entities";

export async function getCards(node: string, secure: boolean, token: string, revision: number): Promise<CardEntity[]> {
  const param = revision ? `&revision=${revision}` : "";
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/cards?agent=${token}${param}`;
  const cards = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(cards.status);
  return await cards.json();
}
