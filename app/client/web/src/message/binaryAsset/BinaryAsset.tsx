import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useBinaryAsset } from './useBinaryAsset.hook';

export function BinaryAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useBinaryAsset(topicId, asset);
  return <div>Binary</div>
}

