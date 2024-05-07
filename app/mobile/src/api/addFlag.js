import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function addFlag(server, guid, channel, topic) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';
  if (channel) {
    const param = topic ? `&topic=${topic}` : '';
    const flag = await fetchWithTimeout(`${protocol}://${server}/account/flag/${guid}?channel=${channel}${param}`, { method: 'POST' } );
    checkResponse(flag);
  }
  else {
    const flag = await fetchWithTimeout(`${protocol}://${server}/account/flag/${guid}`, { method: 'POST' } );
    checkResponse(flag);
  }
}

