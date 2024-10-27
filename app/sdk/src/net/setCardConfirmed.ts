import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardConfirmed(node: string, secure: boolean, token: string, cardId: string): Promise<void> {
  const endpoint = `http${secure ? 's' : ''}://${node}/contact/cards/${cardId}/status?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, {
    method: 'PUT',
    body: JSON.stringify('confirmed'),
  });
  checkResponse(status);
}
