import { checkResponse, fetchWithTimeout } from './fetchUtil';
import { DataMessage } from '../entities';

export async function setCardProfile(node: string, secure: boolean, token: string, cardId: string, data: DataMessage): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${node}/contact/cards/${cardId}/profile?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  checkResponse(status);
}
