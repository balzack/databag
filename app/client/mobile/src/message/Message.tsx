import React from 'react';
import {MessageSmall} from './MessageSmall';
import {MessageLarge} from './MessageLarge';
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
  return <LayoutSelector SmallComponent={MessageSmall} LargeComponent={MessageLarge} props={{topic, card, profile, host, select, selected}} />;
}
