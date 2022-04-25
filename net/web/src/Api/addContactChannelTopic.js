import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactChannelTopic(server, token, channelId, message, assets ) {
  let topic = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics?contact=${token}`,
    { method: 'POST', body: JSON.stringify({}) });
  checkResponse(topic);
  let slot = await topic.json();

  // add each asset

  let subject = { data: JSON.stringify(message, (key, value) => {
      if (value !== null) return value
    }), datatype: 'superbasictopic' };
  let unconfirmed = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${slot.id}/subject?contact=${token}`, 
    { method: 'PUT', body: JSON.stringify(subject) });
  checkResponse(unconfirmed);

  let confirmed = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${slot.id}/confirmed?contact=${token}`,
    { method: 'PUT', body: JSON.stringify('confirmed') });
  checkResponse(confirmed);

  return;
}

