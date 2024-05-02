import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannels(token, revision) {
  let param = "?agent=" + token
  if (revision != null) {
    param += `&channelRevision=${revision}`
  }
  let types = encodeURIComponent(JSON.stringify([ 'sealed', 'superbasic' ]));
  param += `&types=${types}`
  let channels = await fetchWithTimeout('/content/channels' + param, { method: 'GET' });
  checkResponse(channels)
  let ret = await channels.json()
  return ret;
}

