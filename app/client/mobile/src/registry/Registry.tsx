import React from 'react';
import {ContactParams} from '../profile/Profile';
import {RegistryComponent} from './RegistryComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

type RegistryProps = {
  layout: string;
  close?: () => void;
  openContact: (params: ContactParams) => void;
};

export function Registry({layout, close, openContact}: RegistryProps) {
  return <LayoutSelector SmallComponent={RegistryComponent} LargeComponent={RegistryComponent} props={{layout, close, openContact}} />;
}
