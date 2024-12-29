import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'
import { useVideoAsset } from './useVideoAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';

export function VideoAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useVideoAsset(topicId, asset);

  return (<Text>VIDEO</Text>);
}

