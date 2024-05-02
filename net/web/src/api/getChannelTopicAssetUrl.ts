export function getChannelTopicAssetUrl(token, channelId, topicId, assetId) {
  return `/content/channels/${channelId}/topics/${topicId}/assets/${assetId}?agent=${token}`
}

