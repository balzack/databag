import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelNotifications(node: string, secure: boolean, token: string, channelId: string) {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/notification?agent=${token}`;
  const notify = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(notify.status);
  return await notify.json();
}

