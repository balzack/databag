import React, { useState, useEffect } from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useImageAsset } from './useImageAsset.hook';
import { Progress, ActionIcon, Image } from '@mantine/core'
import classes from './ImageAsset.module.css'
import { IconX } from '@tabler/icons-react'

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);
  const [showModal, setShowModal] = useState(false);
  const [showImage, setShowImage] = useState(false); 

  const show = () => {
    setShowModal(true);
  }

  const hide = () => {
    setShowModal(false);
  }

  useEffect(() => {
    if (showModal) {
      setShowImage(true);
      actions.loadImage();
    } else {
      setShowImage(false);
      actions.cancelLoad();
    }
  }, [showModal]);  

  return (
    <div>
      { state.thumbUrl && (
        <div className={classes.asset} onClick={show}>
          <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
        </div>
      )}

      { showModal && (
        <div className={classes.modal} style={ showImage ? { opacity: 1} : { opacity: 0 }}>
          <div className={classes.frame}>
            <Image className={classes.image} fit="contain" src={state.thumbUrl} />
          </div>
          { state.dataUrl && (
            <div className={classes.frame} style={ state.loaded ? { opacity: 1 } : { opacity: 0 }}>
              <Image className={classes.image} fit="contain" src={state.dataUrl} onLoad={actions.setLoaded} />
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

