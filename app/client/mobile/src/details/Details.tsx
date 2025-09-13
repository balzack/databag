import React from 'react';
import {DetailsComponent} from './DetailsComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

type DetailsProps = {
  layout: string;
  close: () => void;
  edit: () => void;
  closeAll: () => void;
};

export function Details({layout, close, edit, closeAll}: DetailsProps) {
  return <LayoutSelector SmallComponent={DetailsComponent} LargeComponent={DetailsComponent} props={{layout, close, edit, closeAll}} />;
}
