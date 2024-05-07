import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannels(server, token, revision) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  let param = "?agent=" + token
  if (revision != null) {
    param += `&channelRevision=${revision}`
  }
  param += `&types=${encodeURIComponent(JSON.stringify(['sealed','superbasic']))}`;
  let channels = await fetchWithTimeout(`${protocol}://${server}/content/channels${param}`, { method: 'GET' });
  checkResponse(channels)
  let ret = await channels.json()
  return ret;
}

