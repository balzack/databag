import React from 'react';
import {useService} from './useService.hook';
import {ServiceSmall} from './ServiceSmall';
import {ServiceLarge} from './ServiceLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

export function Service() {
  const {state} = useService();

  return (
    <LayoutSelector
      layout={state.layout}
      SmallComponent={ServiceSmall}
      LargeComponent={ServiceLarge}
      props={{}}
    />
  );
}
