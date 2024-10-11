import React from 'react'
import { Text } from '@mantine/core';
import classes from './Card.module.css'

export function Card({imageUrl, name, handle, children} : { imageUrl: string, name: string, handle: string, children: ReactNode }) {
console.log("CHILDREN: ", children);

  return (
    <div className={classes.card}>
      <Text>CARD</Text>
      { children }
    </div>
  );
}

