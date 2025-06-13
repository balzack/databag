import React from 'react';
import {useContent} from './useContent.hook';
import {ContentSmall} from './ContentSmall';
import {ContentLarge} from './ContentLarge';
import {createLayoutComponent} from '../utils/LayoutSelector';

type ContentProps = {
  share: {filePath: string; mimeType: string};
  closeAll: () => void;
  openConversation: () => void;
  createConversation: () => void;
  textCard: {cardId: null | string};
};

export const Content = createLayoutComponent<ContentProps>(
  ContentSmall,
  ContentLarge,
  useContent
);
