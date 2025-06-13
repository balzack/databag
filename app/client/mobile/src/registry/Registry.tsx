import React from 'react';
import {ContactParams} from '../profile/Profile';
import {RegistrySmall} from './RegistrySmall';
import {RegistryLarge} from './RegistryLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type RegistryProps = {
  close?: () => void;
  openContact: (params: ContactParams) => void;
};

export function Registry({close, openContact}: RegistryProps) {
  return (
    <LayoutSelector
      SmallComponent={RegistrySmall}
      LargeComponent={RegistryLarge}
      props={{close, openContact}}
    />
  );
}
