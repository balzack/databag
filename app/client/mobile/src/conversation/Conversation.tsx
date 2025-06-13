import React from 'react';
import {useConversation} from './useConversation.hook';
import {ConversationSmall} from './ConversationSmall';
import {ConversationLarge} from './ConversationLarge';

export type MediaAsset = {
  encrypted?: {type: string; thumb: string; label: string; extension: string; parts: {blockIv: string; partId: string}[]};
  image?: {thumb: string; full: string};
  audio?: {label: string; full: string};
  video?: {thumb: string; lq: string; hd: string};
  binary?: {label: string; extension: string; data: string};
};

export function Conversation({close, openDetails, wide}: {close: () => void; openDetails: () => void; wide: boolean}) {
  const {state} = useConversation();

  if (state.layout === 'small') {
    return <ConversationSmall close={close} openDetails={openDetails} wide={wide} />;
  }

  return <ConversationLarge close={close} openDetails={openDetails} wide={wide} />;
}