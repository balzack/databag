import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setContactChannelNotifications(node: string, secure: boolean, guid: string, tokenL string, channelId: string, enabled: boolean) {
  const endpoint = `http${secure ? 's' : ''}://${node}/content/channels/${channelId}/notification?contact=${guid}.${token}`
  const notify = await fetchWithTimeout(endpoint, { method: 'PUT', body: JSON.stringify(enabled) });
  checkResponse(notify)
}

