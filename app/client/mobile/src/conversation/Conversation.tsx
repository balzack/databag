import React from 'react';
import {ConversationComponent} from './ConversationComponent';
import {LayoutSelector} from '../utils/LayoutSelector';

export type MediaAsset = {
  encrypted?: {type: string; thumb: string; label: string; extension: string; parts: {blockIv: string; partId: string}[]};
  image?: {thumb: string; full: string};
  audio?: {label: string; full: string};
  video?: {thumb: string; lq: string; hd: string};
  binary?: {label: string; extension: string; data: string};
};

type ConversationProps = {
  layout: string;
  close: () => void;
  openDetails: () => void;
  wide: boolean;
};

export function Conversation({layout, close, openDetails, wide}: ConversationProps) {
  return <LayoutSelector ComponentComponent={ConversationComponent} LargeComponent={ConversationComponent} props={{layout, close, openDetails, wide}} />;
}
