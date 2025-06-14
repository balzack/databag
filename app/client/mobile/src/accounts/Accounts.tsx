import React from 'react';
import {AccountsSmall} from './AccountsSmall';
import {AccountsLarge} from './AccountsLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type AccountsProps = {
  setup: () => void;
};

export function Accounts({setup}: AccountsProps) {
  return <LayoutSelector SmallComponent={AccountsSmall} LargeComponent={AccountsLarge} props={{setup}} />;
}
