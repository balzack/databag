import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setContactChannelTopicSubject(server, token, channelId, topicId, asset) {
  let host = '';
  if (server) {
    host = `https://${server}`;
  }

  if (asset.image) {
    const formData = new FormData();
    formData.append('asset', asset.image);
    let transform = encodeURIComponent(JSON.stringify(['ithumb;photo', 'icopy;photo']));
    let topicAsset = await fetch(
      `${host}/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&contact=${token}`,
      { method: 'POST', body: formData },
    );
    checkResponse(topicAsset);
    let assetEntry = await topicAsset.json();
    return {
      image: {
        thumb: assetEntry.find((item) => item.transform === 'ithumb;photo').assetId,
        full: assetEntry.find((item) => item.transform === 'icopy;photo').assetId,
      },
    };
  } else if (asset.video) {
    const formData = new FormData();
    formData.append('asset', asset.video);
    let thumb = 'vthumb;video;' + asset.position;
    let transform = encodeURIComponent(JSON.stringify(['vhd;video', 'vlq;video', thumb]));
    let topicAsset = await fetch(
      `${host}/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&contact=${token}`,
      { method: 'POST', body: formData },
    );
    checkResponse(topicAsset);
    let assetEntry = await topicAsset.json();
    return {
      video: {
        thumb: assetEntry.find((item) => item.transform === thumb).assetId,
        lq: assetEntry.find((item) => item.transform === 'vlq;video').assetId,
        hd: assetEntry.find((item) => item.transform === 'vhd;video').assetId,
      },
    };
  } else if (asset.audio) {
    const formData = new FormData();
    formData.append('asset', asset.audio);
    let transform = encodeURIComponent(JSON.stringify(['acopy;audio']));
    let topicAsset = await fetch(
      `${host}/content/channels/${channelId}/topics/${slot.id}/assets?transforms=${transform}&contact=${token}`,
      { method: 'POST', body: formData },
    );
    checkResponse(topicAsset);
    let assetEntry = await topicAsset.json();
    return {
      audio: {
        label: asset.label,
        full: assetEntry.find((item) => item.transform === 'acopy;audio').assetId,
      },
    };
  }
}
