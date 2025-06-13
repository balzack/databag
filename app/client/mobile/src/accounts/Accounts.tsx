import React from 'react';
import {useAccounts} from './useAccounts.hook';
import {AccountsSmall} from './AccountsSmall';
import {AccountsLarge} from './AccountsLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type AccountsProps = {
  setup: () => void;
};

export function Accounts({setup}: AccountsProps) {
  const {state} = useAccounts();

  return (
    <LayoutSelector
      layout={state.layout}
      SmallComponent={AccountsSmall}
      LargeComponent={AccountsLarge}
      props={{setup}}
    />
  );
}
