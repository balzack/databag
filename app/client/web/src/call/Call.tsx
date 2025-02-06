import React, { useEffect, useState } from 'react';
import { useCall } from './useCall.hook';
import classes from './Call.module.css'
import { Card as Contact } from '../card/Card';
import { Colors } from '../constants/Colors';
import { modals } from '@mantine/modals'

export function Call() {
  const { state, actions } = useCall();
  const [ending, setEnding] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [applyingVideo, setApplyingVideo] = useState(false);
  const [accepting, setAccepting] = useState(null as null|string);
  const [ignoring, setIgnoring] = useState(null as null|string);
  const [declining, setDeclining] = useState(null as null|string);

  const showError = () => {
    modals.openConfirmModal({
      title: state.strings.operationFailed,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.tryAgain}</Text>,
      cancelProps: { display: 'none' },
      confirmProps: { display: 'none' },
    })
  }

  const toggleAudio = async () => {
    if (!applyingAudio) {
      setApplyingAudio(true);
      try {
        if (state.audioEnabled) {
          await actions.disableAudio();
        } else if (!state.audioEnabled) {
          await actions.enableAudio();
        }
      } catch (err) {
        console.log(err);
        showError();
      }
      setApplyingAudio(false);
    }
  }

  const toggleVideo = async () => {
    if (!applyingVideo) {
      setApplyingVideo(true);
      try {
        if (state.videoEnabled) {
          await actions.disableVideo();
        } else if (!state.videoEnabled) {
          await actions.enableVideo();
        }
      } catch (err) {
        console.log(err);
        showError();
      }
      setApplyingVideo(false);
    }
  }

  const end = async () => {
    if (!ending) {
      setEnding(true);
      try {
        await actions.end();
      } catch (err) {
        console.log(err);
        showError();
      }
      setEnding(false);
    }
  }

  return (
    <div />
  );
}

