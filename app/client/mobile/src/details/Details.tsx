import React from 'react';
import {useDetails} from './useDetails.hook';
import {DetailsSmall} from './DetailsSmall';
import {DetailsLarge} from './DetailsLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

type DetailsProps = {
  close: () => void;
  edit: () => void;
  closeAll: () => void;
};

export function Details({close, edit, closeAll}: DetailsProps) {
  return <LayoutSelector SmallComponent={DetailsSmall} LargeComponent={DetailsLarge} props={{close, edit, closeAll}} />;
}
