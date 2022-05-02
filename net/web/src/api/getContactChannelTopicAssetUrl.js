export function getContactChannelTopicAssetUrl(server, token, channelId, topicId, assetId) {
  return `https://${server}/content/channels/${channelId}/topics/${topicId}/assets/${assetId}?contact=${token}`
}

