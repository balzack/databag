import React from 'react'
import { ActionIcon, Text, Image } from '@mantine/core'
import { useBinaryFile } from './useBinaryFile.hook'
import classes from './BinaryFile.module.css'
import binary from '../../images/binary.png'
import { TbX } from "react-icons/tb";

export function BinaryFile({ source, disabled, remove }: { source: File; disabled: boolean; remove: () => void }) {
  const { state } = useBinaryFile(source)

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={binary} />
      <Text className={classes.name}>{state.name}</Text>
      <Text className={classes.extension}>{state.extension}</Text>
      {!disabled && (
        <ActionIcon className={classes.close} variant="subtle" onClick={remove}>
          <TbX />
        </ActionIcon>
      )}
    </div>
  )
}
