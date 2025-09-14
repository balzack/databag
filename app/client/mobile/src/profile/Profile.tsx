import React from 'react';
import {ProfileComponent} from './ProfileComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

export type ContactParams = {
  guid: string;
  handle?: string;
  node?: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  cardId?: string;
  status?: string;
  offsync?: boolean;
};

type ProfileProps = {
  layout: string;
  close: () => void;
  params: ContactParams;
};

export function Profile({layout, close, params}: ProfileProps) {
  return <LayoutSelector SmallComponent={ProfileComponent} LargeComponent={ProfileComponent} props={{layout, close, params}} />;
}
