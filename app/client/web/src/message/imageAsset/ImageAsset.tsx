import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useImageAsset } from './useImageAsset.hook';
import { Image } from '@mantine/core'
import classes from './ImageAsset.module.css'

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);

  return (
    <div className={classes.asset}>
      { state.thumbUrl && (
        <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
      )}
    </div>
  );
}

