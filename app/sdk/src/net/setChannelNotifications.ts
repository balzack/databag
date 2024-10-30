import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelNotifications(node: string, secure: boolean, token: string, channelId: string, flag: boolean) {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/notification?agent=${token}`;
  const { status } = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(notify) });
  checkResponse(status);
}
