import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addFlag(node: string, secure: boolean, guid: string, data: { channelId?: string; articleId?: string, topicId?: string }) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/flag/${guid}`;
  const response = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(data) });
  checkResponse(response.status);
}
