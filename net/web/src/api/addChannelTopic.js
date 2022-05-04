import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addChannelTopic(token, channelId, message, assets ) {
  
  if (assets == null || assets.length == 0) {
    let subject = { data: JSON.stringify(message, (key, value) => {
      if (value !== null) return value
    }), datatype: 'superbasictopic' };
    
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
    message.assets = [];
    for (let asset of assets) {
      if (asset.image) {
        const formData = new FormData();
        formData.append('asset', asset.image);
        let transform = encodeURIComponent(JSON.stringify(["ithumb;photo", "icopy;photo"]));
        let topicAsset = await fetch(`/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&agent=${token}`, { method: 'POST', body: formData });
        checkResponse(topicAsset);
        let assetEntry = await topicAsset.json();
        message.assets.push({
          image: {
            thumb: assetEntry.find(item => item.transform === 'ithumb;photo').assetId,
            full: assetEntry.find(item => item.transform === 'icopy;photo').assetId,
          }
        });
      }
      else if (asset.video) {
        const formData = new FormData();
        formData.append('asset', asset.video);
        let transform = encodeURIComponent(JSON.stringify(["vcopy;video", 'vthumb;video']));
        let topicAsset = await fetch(`/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&agent=${token}`, { method: 'POST', body: formData });
        checkResponse(topicAsset);
        let assetEntry = await topicAsset.json();
        message.assets.push({
          video: {
            thumb: assetEntry.find(item => item.transform === 'vthumb;video').assetId,
            full: assetEntry.find(item => item.transform === 'vcopy;video').assetId,
          }
        });
      }
      else if (asset.audio) {
        const formData = new FormData();
        formData.append('asset', asset.audio);
        let transform = encodeURIComponent(JSON.stringify(["acopy;audio"]));
        let topicAsset = await fetch(`/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&agent=${token}`, { method: 'POST', body: formData });
        checkResponse(topicAsset);
        let assetEntry = await topicAsset.json();
        message.assets.push({
          audio: {
            full: assetEntry.find(item => item.transform === 'acopy;audio').assetId,
          }
        });
      }
    }

    let subject = { data: JSON.stringify(message, (key, value) => {
      if (value !== null) return value
    }), datatype: 'superbasictopic' };
 
    let unconfirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/subject?agent=${token}`, 
      { method: 'PUT', body: JSON.stringify(subject) });
    checkResponse(unconfirmed);

    let confirmed = await fetchWithTimeout(`/content/channels/${channelId}/topics/${slot.id}/confirmed?agent=${token}`,
      { method: 'PUT', body: JSON.stringify('confirmed') });
    checkResponse(confirmed);
  }
}

