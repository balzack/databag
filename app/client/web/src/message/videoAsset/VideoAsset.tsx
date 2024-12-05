import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useVideoAsset } from './useVideoAsset.hook';

export function VideoAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useVideoAsset(topicId, asset);
  return <div>Video</div>
}

