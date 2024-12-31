import React, { useState, useRef, useEffect } from 'react';
import { MediaAsset } from '../../conversation/Conversation';
import { useBinaryAsset } from './useBinaryAsset.hook';
import { Progress, ActionIcon, Image } from '@mantine/core'
import classes from './BinaryAsset.module.css'
import { IconDownload, IconX } from '@tabler/icons-react'
import binary from '../../images/binary.png'

export function BinaryAsset({ topicId, asset }: { topicId: string, asset: MediaAsset }) {
  const { state, actions } = useBinaryAsset(topicId, asset);
  const [showModal, setShowModal] = useState(false);
  const [showBinary, setShowBinary] = useState(false); 
  const { label, extension } = asset.encrypted || asset.binary || { label: 'asset', extension: 'dat' };

  const show = () => {
    setShowModal(true);
  }

  const hide = () => {
    setShowModal(false);
  }

  const download = () => {
    console.log("DOWNLOAD");
    const link = document.createElement("a");
    link.download = `${label}.${extension.toLowerCase()}`
    link.href = state.dataUrl;
    link.click();
    link.remove();
  }

  useEffect(() => {
    if (showModal) {
      setShowBinary(true);
      actions.loadBinary();
    } else {
      setShowBinary(false);
      actions.cancelLoad();
    }
  }, [showModal]);  

  return (
    <div>
      <div className={classes.asset} onClick={show}>
        <Image radius="sm" className={classes.thumb} src={binary} fit="contain" />
        <div className={classes.detail}>
          <div className={classes.label}>{ label }</div>
          <div className={classes.extension}>{ extension }</div>
        </div>
        <IconDownload className={classes.download} size={32} />
      </div>

      { showModal && (
        <div className={classes.modal} style={ showBinary ? { opacity: 1} : { opacity: 0 }}>
          <div className={classes.frame}>
            <Image radius="sm" className={classes.image} src={binary} fit="contain" />
            <div className={classes.detail}>
              <div className={classes.label}>{ label }</div>
              <div className={classes.extension}>{ extension }</div>
            </div>
            { state.dataUrl && (
              <IconDownload className={classes.download} size={64} onClick={download} />
            )}
          </div>
          { state.loading && state.loadPercent > 0 && (
            <Progress className={classes.progress} value={state.loadPercent} />
          )}
          <ActionIcon className={classes.close} variant="subtle" size="lg" onClick={hide}>
            <IconX size="lg" />
          </ActionIcon>
        </div>
      )}
    </div>
  );
}

