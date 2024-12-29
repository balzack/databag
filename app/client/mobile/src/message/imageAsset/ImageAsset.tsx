import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'
import { useImageAsset } from './useImageAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (<Text>IMAGE</Text>);
}

