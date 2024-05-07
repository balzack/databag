import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setContactChannelNotifications(server, token, channelId, flag) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  const notify = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/notification?contact=${token}`, { method: 'PUT', body: JSON.stringify(flag) });
  checkResponse(notify)
}

