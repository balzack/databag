import { Topic, Card, Profile } from 'databag-client-sdk';

export function Message({ topic, card, profile }: { topic: Topic, card: Card | null, profile: Profile | null }) {
  console.log(card, profile);
  return <div>CREATED: { topic.created }</div>
}
