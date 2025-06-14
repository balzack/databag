import React from 'react';
import {useService} from './useService.hook';
import {ServiceSmall} from './ServiceSmall';
import {ServiceLarge} from './ServiceLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

export function Service() {
  return <LayoutSelector SmallComponent={ServiceSmall} LargeComponent={ServiceLarge} props={{}} />;
}
