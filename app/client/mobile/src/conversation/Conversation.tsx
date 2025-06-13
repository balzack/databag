import React from 'react';
import {useConversation} from './useConversation.hook';
import {ConversationSmall} from './ConversationSmall';
import {ConversationLarge} from './ConversationLarge';
import {LayoutSelector} from '../utils/LayoutSelector';

export type MediaAsset = {
  encrypted?: {type: string; thumb: string; label: string; extension: string; parts: {blockIv: string; partId: string}[]};
  image?: {thumb: string; full: string};
  audio?: {label: string; full: string};
  video?: {thumb: string; lq: string; hd: string};
  binary?: {label: string; extension: string; data: string};
};

type ConversationProps = {
  close: () => void;
  openDetails: () => void;
  wide: boolean;
};

export function Conversation({close, openDetails, wide}: ConversationProps) {
  return (
    <LayoutSelector
      SmallComponent={ConversationSmall}
      LargeComponent={ConversationLarge}
      props={{close, openDetails, wide}}
    />
  );
}