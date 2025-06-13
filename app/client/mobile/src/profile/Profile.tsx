import React from 'react';
import {useProfile} from './useProfile.hook';
import {ProfileSmall} from './ProfileSmall';
import {ProfileLarge} from './ProfileLarge';
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
  close: () => void;
  params: ContactParams;
};

export function Profile({close, params}: ProfileProps) {
  const {state} = useProfile(params);

  return (
    <LayoutSelector
      layout={state.layout}
      SmallComponent={ProfileSmall}
      LargeComponent={ProfileLarge}
      props={{close, params}}
    />
  );
}
