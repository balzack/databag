import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannels(server, token, revision) {
  let param = "?agent=" + token
  if (revision != null) {
    param += '&channelRevision=' + revision
  }
  let channels = await fetchWithTimeout(`https://${server}/content/channels${param}`, { method: 'GET' });
  checkResponse(channels)
  let ret = await channels.json()
  return ret;
}

