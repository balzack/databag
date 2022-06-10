import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannels(server, token, viewRevision, channelRevision) {
  let param = "?contact=" + token
  if (viewRevision != null) {
    param += '&viewRevision=' + viewRevision
  }
  if (channelRevision != null) {
    param += '&channelRevision=' + channelRevision
  }
  let channels = await fetchWithTimeout(`https://${server}/content/channels${param}`, { method: 'GET' });
  checkResponse(channels)
  return await channels.json()
}

