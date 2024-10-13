import React, { ReactNode } from 'react'
import { Image, Text } from '@mantine/core';
import classes from './Card.module.css'

export function Card({ imageUrl, name, placeholder, handle, node, actions, className }: { className: string, imageUrl: string, name: string, placeholder: string, handle: string, node: string, actions: ReactNode[] }) {

  return (
    <div className={className}>
      <div className={classes.card}>
        <Image radius="sm" className={classes.image} src={imageUrl} />
        <div className={classes.details}>
          { name && (
            <Text className={classes.nameSet}>{ name }</Text>
          )}
          { !name && (
            <Text className={classes.nameUnset}>{ placeholder }</Text>
          )}
          <Text className={classes.handle}>{ node ? `${handle}/${node}` : handle }</Text>
        </div>
        { actions }
      </div>
    </div>
  );
}

