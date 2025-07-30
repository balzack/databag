import React, { useEffect } from 'react'
import { ActionIcon, Image, Text } from '@mantine/core'
import { useAudioFile } from './useAudioFile.hook'
import classes from './AudioFile.module.css'
import audio from '../../images/audio.png'
import { TbX } from "react-icons/tb";

export function AudioFile({ source, updateLabel, disabled, remove }: { source: File; updateLabel: (label: string) => void; disabled: boolean; remove: () => void }) {
  const { state } = useAudioFile(source)

  useEffect(() => {
    updateLabel(state.label)
  }, [state.label])

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={audio} />
      <Text className={classes.label}>{state.label}</Text>
      {!disabled && (
        <ActionIcon className={classes.close} variant="subtle" onClick={remove}>
          <TbX />
        </ActionIcon>
      )}
    </div>
  )
}
