import React from 'react';
import {AccountsComponent} from './AccountsComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

type AccountsProps = {
  setup: () => void;
};

export function Accounts({setup}: AccountsProps) {
  return <LayoutSelector SmallComponent={AccountsComponent} LargeComponent={AccountsComponent} props={{setup}} />;
}
