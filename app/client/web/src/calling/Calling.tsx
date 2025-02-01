import React, { useEffect, useState } from 'react';
import classes from './Calling.module.css'
import { useCalling } from './useCalling.hook';
import { Card } from '../card/Card';
import { Modal, ActionIcon } from '@mantine/core'
import { IconCancel } from '@tabler/icons-react'

export function Calling({ callCard }: { callCard: string }) {
  const [connecting, setConnecting] = useState(false);
  const { state, actions } = useCalling();

  const toggleVideo = async () => {
    if (!applyingVideo) {
      setApplyingVideo(true);
      try {
        if (state.video && state.videoEnabled) {
          await actions.disableVideo();
        } else if (state.video && !state.videoEnabled) {
          await actions.enableVideo();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setApplyingVideo(false);
    }
  }

  const toggleAudio = async () => {
    if (!applyingAudio) {
      setApplyingAudio(true);
      try {
        if (state.audio && state.audioEnabled) {
          await actions.disableAudio();
        } else if (state.audio && !state.audioEnabled) {
          await actions.enableAudio();
        }
      } catch (err) {
        console.log(err);
        setAlert(true);
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
        setAlert(true);
      }
      setEnding(false);
    }
  }

  const call = async (cardId: string) => {
    if (!connecting) {
      setConnecting(true);
      try {
        await actions.call(cardId);
      } catch (err) {
        console.log(err);
        setAlert(true);
      }
      setConnecting(false);
    }
  }

  const accept = async (callId, card) => {
    if (!accepting) {
      setAccepting(callId);
      try {
        await actions.accept(callId, card);
      } catch (err) {
        console.log(err);
        setAlert(true);
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
        setAlert(true);
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
        setAlert(true);
      }
      setDeclining(null);
    }
  }

  const alertParams = {
    title: state.strings.operationFailed,
    prompt: state.strings.tryAgain,
    cancel: {
      label: state.strings.close,
      action: () => {
        setAlert(false);
      },
    },
  };

  useEffect(() => {
    const { cardId } = callCard;
    if (cardId) {
      call(cardId);
    }
  }, [callCard]);

  const calls = state.calls.map((contact, index) => {
    const { callId, card } = contact;
    const { name, handle, node, imageUrl } = card;
    const ignoreButton = <ActionIcon variant="subtle" onClick={()=>{}}><IconCancel /></ActionIcon>
    const declineButton = <ActionIcon variant="subtle" onClick={()=>{}}><IconCancel /></ActionIcon>
    const acceptButton = <ActionIcon variant="subtle" onClick={()=>{}}><IconCancel /></ActionIcon>

    return (
      <div key={index} className={classes.caller}>
        <Card className={classes.card} placeholder={''} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
      </div>
    )
  });

  return (
    <Modal opened={state.calls.length > 0 || connecting || state.calling} onClose={()=>{}} overlayProps={{ backgroundOpacity: 0.55, blur: 3 }} centered withCloseButton={false}>
      { !state.calling && !connecting && state.calls.length > 0 && (
        <div>
        { calls }
        </div>
      )}
      { !state.calling && connecting && (
        <div style={{ width: 100, height: 100, backgroundColor: 'green' }} />
      )}
      { state.calling && (
        <div style={{ width: 100, height: 100, backgroundColor: 'red' }} />
      )}
    </Modal>
  )
}

