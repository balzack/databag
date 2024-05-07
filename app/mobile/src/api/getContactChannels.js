import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannels(server, token, viewRevision, channelRevision) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let param = "?contact=" + token
  if (viewRevision != null) {
    param += `&viewRevision=${viewRevision}`;
  }
  if (channelRevision != null) {
    param += `&channelRevision=${channelRevision}`;
  }
  param += `&types=${encodeURIComponent(JSON.stringify(['sealed','superbasic']))}`;
  let channels = await fetchWithTimeout(`${protocol}://${server}/content/channels${param}`, { method: 'GET' });
  checkResponse(channels)
  return await channels.json()
}

