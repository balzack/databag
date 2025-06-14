import React from 'react';
import {SetupSmall} from './SetupSmall';
import {SetupLarge} from './SetupLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

export function Setup() {
  return <LayoutSelector SmallComponent={SetupSmall} LargeComponent={SetupLarge} props={{}} />;
}
