import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { CardProfileEntity } from '../entities';

export async function getCardProfile(node: string, secure: boolean, token: string, cardId: string): Promise<CardProfileEntity> {
  const endpoint = `http${secure ? 's' : ''}://${node}/contact/cards/${cardId}/profile?agent=${token}`;
  const profile = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(profile.status);
  return await profile.json();
}
