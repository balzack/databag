export function getChannelTopicAssetUrl(server, token, channelId, topicId, assetId) {
  return `https://${server}/content/channels/${channelId}/topics/${topicId}/assets/${assetId}?agent=${token}`
}

