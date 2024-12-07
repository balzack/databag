import React from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useBinaryAsset } from './useBinaryAsset.hook';
import binary from '../../images/binary.png'
import classes from './BinaryAsset.module.css'
import { Image } from '@mantine/core'

export function BinaryAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useBinaryAsset(topicId, asset);
  const { label, extension } = asset.encrypted || asset.binary;
  return (
    <div className={classes.asset}>
      <Image className={classes.thumb} src={binary} fit="contain" />
      <div className={classes.label}>
        <div>{ label }</div>
        <div className={classes.extension}>{ extension }</div>
      </div>
    </div>
  )
}

