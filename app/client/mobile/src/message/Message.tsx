import React from 'react';
import {MessageComponent} from './MessageComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

type MessageProps = {
  topic: Topic;
  card: Card | null;
  profile: Profile | null;
  host: boolean;
  select: (id: null | string) => void;
  selected: string;
};

export function Message({topic, card, profile, host, select, selected}: MessageProps) {
  return <LayoutSelector ComponentComponent={MessageComponent} LargeComponent={MessageComponent} props={{topic, card, profile, host, select, selected}} />;
}
