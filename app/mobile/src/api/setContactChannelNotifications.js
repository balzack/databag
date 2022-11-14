import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setContactChannelNotifications(server, token, channelId, flag) {
  const notify = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/notification?contact=${token}`, { method: 'PUT', body: JSON.stringify(flag) });
  checkResponse(notify)
}

