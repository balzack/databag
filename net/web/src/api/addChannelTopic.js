import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannelTopic(token, channelId, message, assets ) {
  let topic = await fetchWithTimeout(`/content/channels/${channelId}/topics?agent=${token}`,
    { method: 'POST', body: JSON.stringify({}) });
  checkResponse(topic);
  let slot = await topic.json();

  // add each asset

  let subject = { data: JSON.stringify(message, (key, value) => {
      if (value !== null) return value
    }), datatype: 'superbasictopic' };
  let unconfirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/subject?agent=${token}`, 
    { method: 'PUT', body: JSON.stringify(subject) });
  checkResponse(unconfirmed);

  let confirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/confirmed?agent=${token}`,
    { method: 'PUT', body: JSON.stringify('confirmed') });
  checkResponse(confirmed);

  return;
}

