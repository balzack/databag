import React, { useRef, useEffect, useState } from 'react';
import { useCall } from './useCall.hook';
import classes from './Call.module.css'
import { Card as Contact } from '../card/Card';
import { Colors } from '../constants/Colors';
import { modals } from '@mantine/modals'
import { Image, Text, ActionIcon } from '@mantine/core'
import { IconPhone, IconMicrophone, IconMicrophoneOff, IconVideo, IconVideoOff, IconArrowsMinimize } from '@tabler/icons-react'

export function Call() {
  const { state, actions } = useCall();
  const [ending, setEnding] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
  const [applyingVideo, setApplyingVideo] = useState(false);
  const [accepting, setAccepting] = useState(null as null|string);
  const [ignoring, setIgnoring] = useState(null as null|string);
  const [declining, setDeclining] = useState(null as null|string);
  const remote = useRef(null as null|HTMLVideoElement);
  const local = useRef(null as null|HTMLVideoElement);

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

  useEffect(() => {
    if (local.current) {
      local.current.srcObject = state.localStream;
      local.current.load();
      local.current.play();
    }
  }, [state.localStream]);

  useEffect(() => {
    if (remote.current) {
      remote.current.srcObject = state.remoteStream;
      remote.current.load();
      remote.current.play();
    }
  }, [state.remoteStream]);

  return (
    <div className={(state.calling && state.fullscreen) ? classes.active : classes.inactive}>
      { state.calling && (
        <div className={classes.call}>

          { !state.remoteVideo && !state.localVideo && (
            <div className={classes.titleView}>
              { state.calling.name && (
                <Text className={classes.titleName}>{ state.calling.name }</Text>
              )}
              { !state.calling.name && (
                <Text className={classes.titleName}>{ `${state.calling.handle}/${state.calling.node}` }</Text>
              )}
              <div className={classes.image}>
                <div className={classes.frame}>
                  <Image radius="lg" fit="contain" className={classes.logo} src={state.calling.imageUrl} />
                </div>
              </div>
              <Text className={classes.titleStatus}>{ `${Math.floor(state.duration/60)}:${(state.duration % 60).toString().padStart(2, '0')}` }</Text>
            </div>
          )}

          <div className={classes.fullFrame} style={{ display: state.remoteVideo ? 'flex' : 'none' }}>
            <video ref={remote} disablePictureInPicture playsInline autoPlay className={classes.full} />
          </div>
          <div className={state.remoteVideo ? classes.boxFrame : classes.fulLFrame} style={{ display: state.localVideo ? 'flex' : 'none' }}>
            <video ref={local} disablePictureInPicture playsInline autoPlay className={classes.full} />
          </div>

          <div className={classes.buttons}>
            <ActionIcon onClick={()=>actions.setFullscreen(false)} color={Colors.confirmed} size="xl"><IconArrowsMinimize /></ActionIcon>
            <ActionIcon onClick={toggleAudio} disabled={!state.connected} loading={applyingAudio} color={Colors.primary} size="xl">
              { state.audioEnabled && (
                <IconMicrophone />
              )}
              { !state.audioEnabled && (
                <IconMicrophoneOff />
              )}
            </ActionIcon>
            <ActionIcon onClick={toggleVideo} disabled={!state.connected} loading={applyingVideo} color={Colors.primary} size="xl">
              { state.videoEnabled && (
                <IconVideo />
              )}
              { !state.videoEnabled && (
                <IconVideoOff />
              )}
            </ActionIcon>
            <ActionIcon onClick={end} color={Colors.offsync} size="xl"><IconPhone className={classes.off} /></ActionIcon>
          </div>
        </div>
      )}
    </div>
  );
}

