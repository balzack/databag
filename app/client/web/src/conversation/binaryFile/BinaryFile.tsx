import React from 'react';
import { Text, Image } from '@mantine/core'
import { useBinaryFile } from './useBinaryFile.hook';
import classes from './BinaryFile.module.css'
import binary from '../../images/binary.png'

export function BinaryFile({ source }: {source: File}) {
  const { state, actions } = useBinaryFile(source);

  return (
    <div className={classes.asset}>
      <Image radius="sm" className={classes.thumb} src={binary} />
      <Text className={classes.name}>{ state.name }</Text>
      <Text className={classes.extension}>{ state.extension }</Text>
    </div>
  );
}

