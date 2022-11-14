import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelNotifications(server, token, channelId) {
  const notify = await fetchWithTimeout(`https://${server}/content/channels/${channelId}/notification?agent=${token}`, { method: 'GET' });
  checkResponse(notify)
  return await notify.json()
}

