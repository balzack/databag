import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getChannelTopics(server, token, channelId, revision, count, begin, end) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let rev = ''
  if (revision != null) {
    rev = `&revision=${revision}`
  }
  let cnt = ''
  if (count != null) {
    cnt = `&count=${count}`
  }
  let bgn = ''
  if (begin != null) {
    bgn = `&begin=${begin}`
  }
  let edn = ''
  if (end != null) {
    edn = `&end=${end}`
  }
  let topics = await fetchWithTimeout(`${protocol}://${server}/content/channels/${channelId}/topics?agent=${token}${rev}${cnt}${bgn}${edn}`, 
    { method: 'GET' });
  checkResponse(topics)
  return { 
    marker: topics.headers.get('topic-marker'),
    revision: topics.headers.get('topic-revision'),
    topics: await topics.json(),
  }
}

