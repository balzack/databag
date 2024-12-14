import React from 'react';
import { Image } from '@mantine/core'
import { useImageFile } from './useImageFile.hook';
import classes from './ImageFile.module.css'

export function ImageFile({ source }: {source: File}) {
  const { state, actions } = useImageFile(source);

  return (
    <div className={classes.asset}>
      { state.thumbUrl && ( 
        <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
      )}
    </div>
  );
}

