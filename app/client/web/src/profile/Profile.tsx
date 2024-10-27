import React, { useState } from 'react'
import { useProfile } from './useProfile.hook'
import classes from './Profile.module.css'
import { modals } from '@mantine/modals'
import {
  IconX,
  IconMapPin,
  IconBook,
  IconUserX,
  IconRouteX2,
  IconRoute2,
  IconCircleCheck,
  IconVolumeOff,
  IconArrowsCross,
  IconRefresh,
  IconAlertHexagon,
  IconEyeOff,
  IconCancel,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import { Text, Image, ActionIcon } from '@mantine/core'

export type ProfileParams = {
  guid: string
  handle?: string
  node?: string
  name?: string
  location?: string
  description?: string
  imageUrl?: string
  cardId?: string
  status?: string
  offsync?: boolean
}

export function Profile({ params, close }: { params: ProfileParams; close?: () => void }) {
  const { state, actions } = useProfile(params)
  const [removing, setRemoving] = useState(false)
  const [blocking, setBlocking] = useState(false)
  const [ignoring, setIgnoring] = useState(false)
  const [denying, setDenying] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [resyncing, setResyncing] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const confirmReport = () => {
    modals.openConfirmModal({
      title: state.strings.reporting,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.confirmReporting}</Text>,
      labels: { confirm: state.strings.report, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!reporting) {
          setReporting(true)
          await setAction(actions.report)
          setReporting(false)
        }
      },
    })
  }

  const confirmDeny = () => {
    modals.openConfirmModal({
      title: state.strings.denying,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.confirmDenying}</Text>,
      labels: { confirm: state.strings.deny, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!denying) {
          setDenying(true)
          await setAction(actions.deny)
          setDenying(false)
        }
      },
    })
  }

  const confirmDisconnect = () => {
    modals.openConfirmModal({
      title: state.strings.disconnecting,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <text>{state.strings.confirmDisconnecting}</text>,
      labels: { confirm: state.strings.disconnect, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!disconnecting) {
          setDisconnecting(true)
          await setAction(actions.disconnect)
          setDisconnecting(false)
        }
      },
    })
  }

  const confirmIgnore = () => {
    modals.openConfirmModal({
      title: state.strings.ignoring,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.confirmIgnoring}</Text>,
      labels: { confirm: state.strings.ignore, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!ignoring) {
          setIgnoring(true)
          await setAction(actions.ignore)
          setIgnoring(false)
        }
      },
    })
  }

  const confirmBlock = () => {
    modals.openConfirmModal({
      title: state.strings.blocking,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.confirmBlocking}</Text>,
      labels: { confirm: state.strings.block, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!blocking) {
          setBlocking(true)
          await setAction(actions.block)
          setBlocking(false)
        }
      },
    })
  }

  const confirmRemove = () => {
    modals.openConfirmModal({
      title: state.strings.removing,
      withCloseButton: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      children: <Text>{state.strings.confirmRemove}</Text>,
      labels: { confirm: state.strings.remove, cancel: state.strings.cancel },
      onConfirm: async () => {
        if (!removing) {
          setRemoving(true)
          await setAction(actions.remove)
          setRemoving(false)
        }
      },
    })
  }

  const applyAccept = async () => {
    if (!accepting) {
      setAccepting(true)
      await setAction(actions.accept)
      setAccepting(false)
    }
  }

  const applySave = async () => {
    if (!saving) {
      setSaving(true)
      await setAction(actions.save)
      setSaving(false)
    }
  }

  const applyConfirm = async () => {
    if (!confirming) {
      setConfirming(true)
      await setAction(actions.confirm)
      setConfirming(false)
    }
  }

  const applyConnect = async () => {
    if (!connecting) {
      setConnecting(true)
      await setAction(actions.connect)
      setConnecting(false)
    }
  }

  const applyCancel = async () => {
    if (!canceling) {
      setCanceling(true)
      await setAction(actions.cancel)
      setCanceling(false)
    }
  }

  const applyResync = async () => {
    if (!resyncing) {
      setResyncing(true)
      await setAction(actions.resync)
      setResyncing(false)
    }
  }

  const setAction = async (action: () => Promise<void>) => {
    try {
      await action()
    } catch (err) {
      console.log(err)
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
  }

  return (
    <div className={classes.contact}>
      <div className={classes.detail}>
        <div className={classes.header}>
          {close && <IconX size={28} className={classes.match} />}
          <Text className={classes.label}>{`${state.handle}${state.node ? '/' + state.node : ''}`}</Text>
          {close && <IconX size={30} className={classes.close} onClick={close} />}
        </div>
        <div className={classes.image}>
          <Image radius="md" src={state.imageUrl} />
        </div>
        <div className={classes.divider} />
        {!state.name && <Text className={classes.nameUnset}>{state.strings.name}</Text>}
        {state.name && <Text className={classes.nameSet}>{state.name}</Text>}
        <div className={classes.entry}>
          <div className={classes.entryIcon}>
            <IconMapPin />
          </div>
          {!state.location && <Text className={classes.entryUnset}>{state.strings.location}</Text>}
          {state.location && <Text className={classes.entrySet}>{state.location}</Text>}
        </div>
        <div className={classes.entry}>
          <div className={classes.entryIcon}>
            <IconBook />
          </div>
          {!state.description && <Text className={classes.entryUnset}>{state.strings.description}</Text>}
          {state.description && <Text className={classes.entrySet}>{state.description}</Text>}
        </div>
        <div className={classes.divider} />
        <div className={classes.status}>
          <Text className={classes[state.statusLabel]}>{state.strings[state.statusLabel]}</Text>
        </div>
        {state.statusLabel === 'unknownStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={applySave}>
              <ActionIcon variant="subtle" loading={saving}>
                <IconDeviceFloppy />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.save}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'savedStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={applyConnect}>
              <ActionIcon variant="subtle" loading={connecting}>
                <IconRoute2 />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.connect}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'pendingStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={applyConfirm}>
              <ActionIcon variant="subtle" loading={confirming}>
                <IconDeviceFloppy />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.save}</Text>
            </div>
            <div className={classes.action} onClick={applyAccept}>
              <ActionIcon variant="subtle" loading={accepting}>
                <IconCircleCheck />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.accept}</Text>
            </div>
            <div className={classes.action} onClick={confirmIgnore}>
              <ActionIcon variant="subtle" loading={ignoring}>
                <IconVolumeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.ignore}</Text>
            </div>
            <div className={classes.action} onClick={confirmDeny}>
              <ActionIcon variant="subtle" loading={denying}>
                <IconArrowsCross />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.deny}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'requestedStatus' && (
          <div className={classes.actions} onClick={applyAccept}>
            <div className={classes.action}>
              <ActionIcon variant="subtle" loading={accepting}>
                <IconCircleCheck />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.accept}</Text>
            </div>
            <div className={classes.action} onClick={confirmIgnore}>
              <ActionIcon variant="subtle" loading={ignoring}>
                <IconVolumeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.ignore}</Text>
            </div>
            <div className={classes.action} onClick={confirmDeny}>
              <ActionIcon variant="subtle" loading={denying}>
                <IconArrowsCross />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.deny}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'connectingStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={applyCancel}>
              <ActionIcon variant="subtle" loading={canceling}>
                <IconCancel />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.cancel}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'connectedStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={confirmDisconnect}>
              <ActionIcon variant="subtle" loading={disconnecting}>
                <IconRouteX2 />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.disconnect}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
        {state.statusLabel === 'offsyncStatus' && (
          <div className={classes.actions}>
            <div className={classes.action} onClick={applyResync}>
              <ActionIcon variant="subtle" loading={resyncing}>
                <IconRefresh />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.resync}</Text>
            </div>
            <div className={classes.action} onClick={confirmDisconnect}>
              <ActionIcon variant="subtle" loading={disconnecting}>
                <IconRouteX2 />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.disconnect}</Text>
            </div>
            <div className={classes.action} onClick={confirmRemove}>
              <ActionIcon variant="subtle" loading={removing}>
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.remove}</Text>
            </div>
            <div className={classes.action} onClick={confirmBlock}>
              <ActionIcon variant="subtle" loading={blocking}>
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.block}</Text>
            </div>
            <div className={classes.action} onClick={confirmReport}>
              <ActionIcon variant="subtle" loading={reporting}>
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{state.strings.report}</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

//save - DeviceFloppy - save
//cancel - Cancel - cancel
//block - EyeOff - block
//report - AlertHexagon - report
//resync - Refresh - resync
//deny - ArrowsCross - deny
//ignore - VolumeOff - ignore
//accept - CircleCheck - accept
//connect - Route2 - connect
//disconnect - RouteX2 - disconnect
//remove - UserX - remove
