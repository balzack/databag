import React from 'react';
import {useProfile} from './useProfile.hook';
import {ProfileSmall} from './ProfileSmall';
import {ProfileLarge} from './ProfileLarge';
import {createLayoutComponent} from '../utils/LayoutSelector';

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

  if (state.layout === 'small') {
    return <ProfileSmall close={close} params={params} />;
  }

  return <ProfileLarge close={close} params={params} />;
}
