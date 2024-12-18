import React, { useState } from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useImageAsset } from './useImageAsset.hook';
import { ActionIcon, Modal, Image } from '@mantine/core'
import classes from './ImageAsset.module.css'
import { IconX } from '@tabler/icons-react'

export function ImageAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useImageAsset(topicId, asset);
  const [show, setShow] = useState(false);

  const showImage = () => {
    setShow(true);
    actions.loadImage();
  }

  return (
    <div>
      { state.thumbUrl && (
        <div className={classes.asset} onClick={showImage}>
          <Image radius="sm" className={classes.thumb} src={state.thumbUrl} />
        </div>
      )}

      <Modal className={classes.modal} opened={show} onClose={() => setShow(false)} padding={0} size="xl" overlayProps={{ backgroundOpacity: 0.65, blur: 3 }} centered withCloseButton={false}>
          { !state.dataUrl && (
            <div className={classes.body}>
              <Image radius="lg" className={classes.image} fit="contain" src={state.thumbUrl} />
              <div className={classes.frame}>
                <ActionIcon variant="subtle" size="lg" onClick={() => setShow(false)}>
                  <IconX size="lg" />
                </ActionIcon>
              </div>
            </div>
          )}
          { state.dataUrl && (
            <div className={classes.body}>
              <Image radius="lg" className={classes.image} fit="contain" src={state.dataUrl} />
              <div className={classes.frame}>
                <ActionIcon variant="subtle" size="lg" onClick={() => setShow(false)}>
                  <IconX size="lg" />
                </ActionIcon>
              </div>
            </div>
          )}
      </Modal>
    </div>
  );
}

