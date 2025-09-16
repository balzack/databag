import React from 'react'
import { ActionIcon, Image } from '@mantine/core'
import { useImageFile } from './useImageFile.hook'
import classes from './ImageFile.module.css'
import { TbX } from "react-icons/tb";

export function ImageFile({ source, disabled, remove }: { source: File; disabled: boolean; remove: () => void }) {
  const { state } = useImageFile(source)

  return (
    <div className={classes.asset}>
      {state.thumbUrl && <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />}
      {!disabled && state.thumbUrl && (
        <ActionIcon className={classes.close} variant="subtle" disabled={disabled} onClick={remove}>
          <TbX />
        </ActionIcon>
      )}
    </div>
  )
}
