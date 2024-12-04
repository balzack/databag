import { Topic } from 'databag-client-sdk';

export function Message({ topic }: { topic: Topic}) {
  return <div>CREATED: { topic.created }</div>
}
