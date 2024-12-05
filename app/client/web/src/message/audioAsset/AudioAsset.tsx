import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useAudioAsset } from './useAudioAsset.hook';

export function AudioAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useAudioAsset(topicId, asset);
  return <div>Audio</div>
}

