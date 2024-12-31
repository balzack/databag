import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-paper'
import { useAudioAsset } from './useAudioAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';

export function AudioAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useAudioAsset(topicId, asset);

  return (<Text>AUDIO</Text>);
}

