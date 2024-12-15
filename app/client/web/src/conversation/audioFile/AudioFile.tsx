import React from 'react';
import { Image, Textarea } from '@mantine/core'
import { useAudioFile } from './useAudioFile.hook';
import classes from './AudioFile.module.css'
import audio from '../../images/audio.png'

export function AudioFile({ source, updateLabel, disabled }: {source: File, updateLabel: (label: string)=>void, disabled: boolean}) {
  const { state, actions } = useAudioFile(source);

  const setLabel = (label: string) => {
    updateLabel(label);
    actions.setLabel(label);
  }

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={audio} />
      <Textarea className={classes.label} size="xs" value={state.label} onChange={(event) => setLabel(event.currentTarget.value)} disabled={disabled} />
    </div>
  );
}

