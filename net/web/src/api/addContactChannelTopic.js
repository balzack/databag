import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addContactChannelTopic(server, token, channelId, message, assets ) {

  let subject = { data: JSON.stringify(message, (key, value) => {
    if (value !== null) return value
  }), datatype: 'superbasictopic' };

  if (assets == null || assets.length == 0) {
    let topic = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics?contact=${token}&confirm=true`,
      { method: 'POST', body: JSON.stringify(subject) });
    checkResponse(topic);
  }
  else {
    let topic = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics?contact=${token}`,
      { method: 'POST', body: JSON.stringify({}) });
    checkResponse(topic);
    let slot = await topic.json();

    // add each asset

    let unconfirmed = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${slot.id}/subject?contact=${token}`, 
      { method: 'PUT', body: JSON.stringify(subject) });
    checkResponse(unconfirmed);

    let confirmed = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/topics/${slot.id}/confirmed?contact=${token}`,
      { method: 'PUT', body: JSON.stringify('confirmed') });
    checkResponse(confirmed);
  }
}

