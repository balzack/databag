import React from 'react';
import {SetupComponent} from './SetupComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

export function Setup() {
  return <LayoutSelector SmallComponent={SetupComponent} LargeComponent={SetupComponent} props={{}} />;
}
