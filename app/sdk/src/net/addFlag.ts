import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addFlag(node: string, secure: string, guid: string, data: { channelId?: string, articleId: string }) {
  const endpoint = `http${secure ? 's' : ''}://${node}/account/flag/${guid}`
  const status = await fetchWithTimeout(endpoint, { method: 'POST', body: JSON.stringify(data) } );
  checkResponse(status);
}

