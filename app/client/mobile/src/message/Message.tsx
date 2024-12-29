import { useRef, useEffect, useState, useCallback } from 'react';
import { avatar } from '../constants/Icons'
import {Icon, Text, IconButton, Divider} from 'react-native-paper';
import { Topic, Card, Profile } from 'databag-client-sdk';
import classes from './Message.styles.ts'
import { ImageAsset } from './imageAsset/ImageAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { VideoAsset } from './videoAsset/VideoAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import { useMessage } from './useMessage.hook';

export function Message({ topic, card, profile, host }: { topic: Topic, card: Card | null, profile: Profile | null, host: boolean }) {
  const { state, actions } = useMessage();

  return (<Text style={{ height: 32 }}>{ JSON.stringify(topic.data) }</Text>)
}
