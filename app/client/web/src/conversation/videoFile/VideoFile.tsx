import React, { useRef, useState } from 'react';
import { ActionIcon, Image } from '@mantine/core'
import { useVideoFile } from './useVideoFile.hook';
import classes from './VideoFile.module.css'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export function VideoFile({ source, thumbPosition, disabled }: {source: File, thumbPosition: (position: number)=>void, disabled: boolean}) {
  const { state, actions } = useVideoFile(source);
  const [loaded, setLoaded] = useState(false);
  const position = useRef(0);
  const player = useRef();

  const seek = (offset: number) => {
    if (player.current) {
      const len = player.current.duration;
      if (len > 16) {
        position.current += offset * Math.floor(len / 16);
      }
      else {
        position.current += offset;
      }
      if (position.current < 0 || position.current >= len) {
        position.current = 0;
      }
      thumbPosition(position.current);
      player.current.currentTime = position.current;
      player.current.play();
    }
  }

  const onPause = () => {
    player.current.pause();
  }

  return (
    <div className={classes.asset}>
      { state.videoUrl && (
        <video ref={player} muted onLoadedMetadata={() => setLoaded(true)} onPlay={onPause} src={state.videoUrl} width={'auto'} height={'100%'} playsinline="true" />
      )}
      { loaded && !disabled && (
        <ActionIcon className={classes.right} variant="light" onClick={() => seek(1)}>
          <IconChevronRight />
        </ActionIcon>
      )}
      { loaded && !disabled && (
        <ActionIcon className={classes.left} variant="light" onClick={() => seek(-1)}>
          <IconChevronLeft />
        </ActionIcon>
      )}
    </div>
  );
}

