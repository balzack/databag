import React, { useState, useEffect } from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useVideoAsset } from './useVideoAsset.hook';
import { Progress, ActionIcon, Image } from '@mantine/core'
import classes from './VideoAsset.module.css'
import { IconPlayerPlay, IconX } from '@tabler/icons-react'
import { useResizeDetector } from 'react-resize-detector';

export function VideoAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useVideoAsset(topicId, asset);
  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false); 
  const { width, height, ref } = useResizeDetector();

  const show = () => {
    setShowModal(true);
  }

  const hide = () => {
    setShowModal(false);
  }

  useEffect(() => {
    if (showModal) {
      setShowVideo(true);
      actions.loadVideo();
    } else {
      setShowVideo(false);
      actions.cancelLoad();
    }
  }, [showModal]);  

  return (
    <div>
      { state.thumbUrl && (
        <div className={classes.asset} onClick={show}>
          <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
          <IconPlayerPlay className={classes.play} size={32} />
        </div>
      )}

      { showModal && (
        <div className={classes.modal} style={ showVideo ? { opacity: 1} : { opacity: 0 }}>
          <div className={classes.frame} style={state.dataUrl? {opacity: 0} : {opacity: 1}}>
            <Image ref={ref} className={classes.image} fit="contain" src={state.thumbUrl} />
          </div>
          { state.dataUrl && (
            <div className={classes.video} style={{ width, height }}>
              <video className={classes.image} controls width={width} height={height} src={state.dataUrl} playsInline={true} autoPlay={true} />
            </div>
          )}
          { state.loading && state.loadPercent > 0 && (
            <Progress className={classes.progress} value={state.loadPercent} />
          )}
          <ActionIcon className={classes.close} variant="filled" size="lg" onClick={hide}>
            <IconX size="lg" />
          </ActionIcon>
        </div>
      )}
    </div>
  );
}

