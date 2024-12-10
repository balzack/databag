import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useAudioAsset } from './useAudioAsset.hook';
import audio from '../../images/audio.png'
import classes from './AudioAsset.module.css'
import { Image } from '@mantine/core'

export function AudioAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useAudioAsset(topicId, asset);
  const { label } = asset.encrypted || asset.audio || { label: '' };

  return (
    <div className={classes.asset}>
      <Image className={classes.thumb} src={audio} fit="contain" />
      <div className={classes.label}>{ label }</div>
    </div>
  )
}

