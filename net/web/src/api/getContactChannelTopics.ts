import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function getContactChannelTopics(server, token, channelId, revision, count, begin, end) {
  let host = '';
  if (server) {
    host = `https://${server}`;
  }

  let rev = '';
  if (revision != null) {
    rev = `&revision=${revision}`;
  }
  let cnt = '';
  if (count != null) {
    cnt = `&count=${count}`;
  }
  let bgn = '';
  if (begin != null) {
    bgn = `&begin=${begin}`;
  }
  let edn = '';
  if (end != null) {
    edn = `&end=${end}`;
  }
  let topics = await fetchWithTimeout(
    `${host}/content/channels/${channelId}/topics?contact=${token}${rev}${cnt}${bgn}${edn}`,
    { method: 'GET' },
  );
  checkResponse(topics);
  return {
    marker: topics.headers.get('topic-marker'),
    revision: topics.headers.get('topic-revision'),
    topics: await topics.json(),
  };
}
