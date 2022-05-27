import { checkResponse, fetchWithTimeout } from './fetchUtil';

export async function setChannelTopicSubject(token, channelId, topicId, data) {
  let subject = { data: JSON.stringify(data, (key, value) => {
    if (value !== null) return value
  }), datatype: 'superbasictopic' };

  let channel = await fetchWithTimeout(`/content/channels/${channelId}/topics/${topicId}/subject?agent=${token}`,
    { method: 'PUT', body: JSON.stringify(subject) });
  checkResponse(channel);
}
