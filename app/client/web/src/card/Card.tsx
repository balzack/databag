import React, { ReactNode } from 'react'
import { Image, Text } from '@mantine/core'
import classes from './Card.module.css'

export function Card({
  imageUrl,
  name,
  placeholder,
  handle,
  node,
  select,
  actions,
  className,
}: {
  className: string
  imageUrl: string
  name: string
  placeholder: string
  handle: string
  node: string
  select?: () => void
  actions: ReactNode[]
}) {
  return (
    <div className={className}>
      <div className={classes.card}>
        <div className={select ? classes.cursor : classes.nocursor} onClick={select ? select : () => {}}>
          <Image radius="sm" className={classes.image} src={imageUrl} />
          <div className={classes.details}>
            {name && <Text className={classes.nameSet}>{name}</Text>}
            {!name && <Text className={classes.nameUnset}>{placeholder}</Text>}
            <Text className={classes.handle}>{node ? `${handle}/${node}` : handle}</Text>
          </div>
        </div>
        {actions}
      </div>
    </div>
  )
}
