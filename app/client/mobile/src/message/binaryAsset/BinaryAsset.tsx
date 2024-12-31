import React, { useState, useEffect } from 'react';
import { Text } from 'react-native-paper'
import { useBinaryAsset } from './useBinaryAsset.hook';
import { MediaAsset } from '../../conversation/Conversation';

export function BinaryAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useBinaryAsset(topicId, asset);

  return (<Text>BINARY</Text>);
}

