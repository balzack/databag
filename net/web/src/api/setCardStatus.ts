import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardConnecting(token, cardId) {
  let card = await fetchWithTimeout(`/contact/cards/${cardId}/status?agent=${token}`, {
    method: 'PUT',
    body: JSON.stringify('connecting'),
  });
  checkResponse(card);
  return await card.json();
}

export async function setCardConnected(token, cardId, access, view, article, channel, profile) {
  let card = await fetchWithTimeout(
    `/contact/cards/${cardId}/status?agent=${token}&token=${access}&viewRevision=${view}&articleRevision=${article}&channelRevision=${channel}&profileRevision=${profile}`,
    { method: 'PUT', body: JSON.stringify('connected') },
  );
  checkResponse(card);
  return await card.json();
}

export async function setCardConfirmed(token, cardId) {
  let card = await fetchWithTimeout(`/contact/cards/${cardId}/status?agent=${token}`, {
    method: 'PUT',
    body: JSON.stringify('confirmed'),
  });
  checkResponse(card);
  return await card.json();
}
