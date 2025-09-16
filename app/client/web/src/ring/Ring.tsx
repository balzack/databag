import React, { useEffect, useState, useRef } from 'react'
import { useRing } from './useRing.hook'
import classes from './Ring.module.css'
import { Card as Contact } from '../card/Card'
import { Card } from 'databag-client-sdk'
import { Colors } from '../constants/Colors'
import { modals } from '@mantine/modals'
import { Loader, Text, ActionIcon } from '@mantine/core'
import { TbBell, TbVideoPlus, TbEyeX, TbPhone, TbArrowsMaximize, TbMicrophone, TbMicrophoneOff } from "react-icons/tb";

export function Ring() {
  const { state, actions } = useRing()
  const [ending, setEnding] = useState(false)
  const [applyingAudio, setApplyingAudio] = useState(false)
  const [accepting, setAccepting] = useState(null as null | string)
  const [ignoring, setIgnoring] = useState(null as null | string)
  const [declining, setDeclining] = useState(null as null | string)
  const [ringing, setRinging] = useState(0)
  const counter = useRef(0)

  useEffect(() => {
    const count = setInterval(() => {
      counter.current += 1
      setRinging(counter.current)
    }, 500)
    return () => clearInterval(count)
  }, [])

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
      setApplyingAudio(true)
      try {
        if (state.audioEnabled) {
          await actions.disableAudio()
        } else if (!state.audioEnabled) {
          await actions.enableAudio()
        }
      } catch (err) {
        console.log(err)
        showError()
      }
      setApplyingAudio(false)
    }
  }

  const end = async () => {
    if (!ending) {
      setEnding(true)
      try {
        await actions.end()
      } catch (err) {
        console.log(err)
        showError()
      }
      setEnding(false)
    }
  }

  const accept = async (callId: string, card: Card) => {
    if (!accepting) {
      setAccepting(callId)
      try {
        await actions.accept(callId, card)
      } catch (err) {
        console.log(err)
        showError()
      }
      setAccepting(null)
    }
  }

  const ignore = async (callId: string, card: Card) => {
    if (!ignoring) {
      setIgnoring(callId)
      try {
        await actions.ignore(callId, card)
      } catch (err) {
        console.log(err)
        showError()
      }
      setIgnoring(null)
    }
  }

  const decline = async (callId: string, card: Card) => {
    if (!declining) {
      setDeclining(callId)
      try {
        await actions.decline(callId, card)
      } catch (err) {
        console.log(err)
        showError()
      }
      setDeclining(null)
    }
  }

  const calls = state.calls.map((ring, index) => {
    const { callId, card } = ring
    const { name, handle, node, imageUrl } = card
    const ignoreButton = (
      <ActionIcon key="ignore" variant="subtle" loading={ignoring === ring.callId} onClick={() => ignore(callId, card)} color={Colors.pending}>
        <TbEyeX />
      </ActionIcon>
    )
    const declineButton = (
      <div key="decline" className={classes.space}>
        <ActionIcon variant="subtle" loading={declining === ring.callId} onClick={() => decline(callId, card)} color={Colors.offsync}>
          <TbPhone className={classes.off} />
        </ActionIcon>
      </div>
    )
    const acceptButton = (
      <ActionIcon key="accept" variant="subtle" loading={accepting === ring.callId} onClick={() => accept(callId, card)} color={Colors.primary}>
        <TbPhone />
      </ActionIcon>
    )

    return <Contact key={`ring-${index}`} className={classes.card} placeholder={''} imageUrl={imageUrl} name={name} node={node} handle={handle} actions={[ignoreButton, declineButton, acceptButton]} />
  })

  return (
    <div className={accepting || state.calling || state.calls.length > 0 ? classes.active : classes.inactive}>
      {state.calls.length > 0 && !accepting && !state.calling && <div className={classes.ring}>{calls[0]}</div>}
      {accepting && !state.calling && (
        <div className={classes.ring}>
          <Loader size={32} />
        </div>
      )}
      {state.calling && (
        <div className={classes.ring}>
          <ActionIcon variant="subtle" loading={applyingAudio} disabled={!state.connected} className={classes.circleIcon} color={Colors.primary} onClick={toggleAudio}>
            {state.audioEnabled && <TbMicrophone />}
            {!state.audioEnabled && <TbMicrophoneOff />}
          </ActionIcon>
          <ActionIcon variant="subtle" disabled={!state.connected} className={classes.circleIcon} color={Colors.confirmed} onClick={() => actions.setFullscreen(true)}>
            {(state.localVideo || state.remoteVideo) && <TbVideoPlus />}
            {!state.localVideo && !state.remoteVideo && <TbArrowsMaximize />}
          </ActionIcon>
          <div className={classes.name}>
            {state.calling.name && <Text className={classes.nameSet}>{state.calling.name}</Text>}
            {!state.calling.name && <Text className={classes.nameUnset}>{state.strings.name}</Text>}
          </div>
          <div className={classes.status}>
            {state.connected && <Text className={classes.duration}>{`${Math.floor(state.duration / 60)}:${(state.duration % 60).toString().padStart(2, '0')}`}</Text>}
            {!state.connected && <TbBell size={18} color={Colors.primary} style={{ rotate: ringing % 2 == 0 ? '15deg' : '-15deg' }} />}
          </div>
          <div className={classes.end}>
            <ActionIcon variant="subtle" loading={ending} onClick={end} color={Colors.offsync}>
              <TbPhone className={classes.off} />
            </ActionIcon>
          </div>
        </div>
      )}
    </div>
  )
}
