import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelNotifications(server, token, channelId) {
  const notify = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/notification?contact=${token}`, { method: 'GET' });
  checkResponse(notify)
  return await notify.json()
}

