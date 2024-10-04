import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { CardStatus } from '../entities';

export async function getCardOpenMessage(node: string, secure: boolean): Promise<CardStatus> {
  const endpoint = `http${secure ? "s" : ""}://${node}/contact/openMessage`;
  const open = await fetchWithTimeout(endpoint, { method: "GET" });
  checkResponse(open.status);
}

