import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannelTopic(token, channelId, message, assets ) {
  
  let subject = { data: JSON.stringify(message, (key, value) => {
    if (value !== null) return value
  }), datatype: 'superbasictopic' };
  
  if (assets == null || assets.length == 0) {
    let topic = await fetchWithTimeout(`/content/channels/${channelId}/topics?agent=${token}&confirm=true`,
      { method: 'POST', body: JSON.stringify(subject) });
    checkResponse(topic);
  }
  else {
    let topic = await fetchWithTimeout(`/content/channels/${channelId}/topics?agent=${token}`,
      { method: 'POST', body: JSON.stringify({}) });
    checkResponse(topic);
    let slot = await topic.json();

    // add each asset
    for (let asset of assets) {
      const formData = new FormData();
      formData.append('asset', asset.image);
      let transform = encodeURIComponent(JSON.stringify(["ithumb;photo"]));
      let topicAsset = await fetch(`/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&agent=${token}`, { method: 'POST', body: formData });
      checkResponse(topicAsset);
console.log(await topicAsset.json());
    }

    let unconfirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/subject?agent=${token}`, 
      { method: 'PUT', body: JSON.stringify(subject) });
    checkResponse(unconfirmed);

    let confirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/confirmed?agent=${token}`,
      { method: 'PUT', body: JSON.stringify('confirmed') });
    checkResponse(confirmed);
  }
}

