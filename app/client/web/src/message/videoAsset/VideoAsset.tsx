import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useVideoAsset } from './useVideoAsset.hook';
import { Image } from '@mantine/core'
import classes from './VideoAsset.module.css'

export function VideoAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useVideoAsset(topicId, asset);

  return (
    <div className={classes.asset}>
      { state.thumbUrl && (
        <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
      )}
    </div>
  );
}

