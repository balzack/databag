import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelNotifications(node: string, secure: boolean, guid: string, token: string, channelId: string): Promise<boolean> {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/notification?contact=${guid}.${token}`
  const notify = await fetchWithTimeout(endpoint, { method: 'GET' });
  checkResponse(notify.status)
  return await notify.json()
}

