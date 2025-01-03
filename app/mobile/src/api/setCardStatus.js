import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setCardConnecting(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let card = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}/status?agent=${token}`, { method: 'PUT', body: JSON.stringify('connecting') } );
  checkResponse(card);
  return await card.json();
}

export async function setCardConnected(server, token, cardId, access, view, article, channel, profile) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let card = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}/status?agent=${token}&token=${access}&viewRevision=${view}&articleRevision=${article}&channelRevision=${channel}&profileRevision=${profile}`, { method: 'PUT', body: JSON.stringify('connected') } );
  checkResponse(card);
  return await card.json();
}

export async function setCardConfirmed(server, token, cardId) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let card = await fetchWithTimeout(`${protocol}://${server}/contact/cards/${cardId}/status?agent=${token}`, { method: 'PUT', body: JSON.stringify('confirmed') } );
  checkResponse(card);
  return await card.json();
}

