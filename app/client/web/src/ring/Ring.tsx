import React, { useEffect, useState } from 'react';
import { useRing } from './useRing.hook';
import classes from './Ring.module.css';
import { Card as Contact } from '../card/Card';
import { Colors } from '../constants/Colors';
import { modals } from '@mantine/modals'
import { Loader, Image, Text, ActionIcon } from '@mantine/core'
import { IconEyeX, IconPhone, IconPhoneOff, IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react'

export function Ring() {
  const { state, actions } = useRing();
  const [ending, setEnding] = useState(false);
  const [applyingAudio, setApplyingAudio] = useState(false);
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

  const accept = async (callId, card) => {
    if (!accepting) {
      setAccepting(callId);
      try {
        await actions.accept(callId, card);
      } catch (err) {
        console.log(err);
        showError();
      }
      setAccepting(null);
    }
  }

  const ignore = async (callId, card) => {
    if (!ignoring) {
      setIgnoring(callId);
      try {
        await actions.ignore(callId, card);
      } catch (err) {
        console.log(err);
        showError();
      }
      setIgnoring(null);
    }
  }

  const decline = async (callId, card) => {
    if (!declining) {
      setDeclining(callId);
      try {
        await actions.decline(callId, card);
      } catch (err) {
        console.log(err);
        showError();
      }
      setDeclining(null);
    }
  }

  const calls = state.calls.map((ring, index) => {
    const { name, handle, node, imageUrl } = ring.card;
    const ignoreButton = <ActionIcon key="ignore" variant="subtle" loading={ignoring===ring.callId} onClick={()=>ignore(ring)} color={Colors.pending}><IconEyeX /></ActionIcon>
    const declineButton = <div key="decline" className={classes.space}><ActionIcon variant="subtle" loading={declining===ring.callId} onClick={()=>decline(ring)} color={Colors.offsync}><IconPhone className={classes.off} /></ActionIcon></div>
    const acceptButton = <ActionIcon key="accept" variant="subtle" loading={accepting===ring.callId} onClick={()=>accept(ring)} color={Colors.primary}><IconPhone /></ActionIcon>

    return (
      <div key={index} className={classes.caller}>
        <Contact className={classes.card} placeholder={''} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
      </div>
    )
  });

  return (
    <div style={{ width: '100%', height: 14, backgroundColor: 'yellow' }} />
  );
}

