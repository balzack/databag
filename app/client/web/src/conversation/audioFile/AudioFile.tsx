import React, { useEffect } from 'react';
import { ActionIcon, Image, Text } from '@mantine/core'
import { useAudioFile } from './useAudioFile.hook';
import classes from './AudioFile.module.css'
import audio from '../../images/audio.png'
import { IconX } from '@tabler/icons-react'

export function AudioFile({ source, updateLabel, disabled, remove }: {source: File, updateLabel: (label: string)=>void, disabled: boolean, remove: ()=>void}) {
  const { state, actions } = useAudioFile(source);

  const setLabel = (label: string) => {
    updateLabel(label);
    actions.setLabel(label);
  }

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={audio} />
      <Text className={classes.label}>{ state.label }</Text>
      <ActionIcon className={classes.close} variant="subtle" disabled={disabled} onClick={remove}>
        <IconX />
      </ActionIcon>
    </div>
  );
}

