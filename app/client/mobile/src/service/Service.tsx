import React from 'react';
import {ServiceComponent} from './ServiceComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

export function Service() {
  return <LayoutSelector SmallComponent={ServiceComponent} LargeComponent={ServiceComponent} props={{}} />;
}
