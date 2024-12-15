import React from 'react';
import { Image } from '@mantine/core'
import { useAudioFile } from './useAudioFile.hook';
import classes from './AudioFile.module.css'
import audio from '../../images/audio.png'

export function AudioFile({ source }: {source: File}) {
  const { state, actions } = useAudioFile(source);

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={audio} />
    </div>
  );
}

