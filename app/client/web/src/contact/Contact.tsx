import React, {useEffect} from 'react';
import { useContact } from './useContact.hook';
import classes from './Contact.module.css';
import { IconX, IconMapPin, IconBook, IconUserX, IconRouteX2, IconRoute2, IconCircleCheck, IconVolumeOff, IconArrowsCross, IconRefresh, IconAlertHexagon, IconEyeOff, IconCancel, IconDeviceFloppy } from '@tabler/icons-react';
import {
  Text,
  Image,
  ActionIcon,
  Button,
} from '@mantine/core'

export type ContactParams = {
  guid: string;
  handle?: string;
  node?: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  cardId?: string;
  status?: string;
  offysnc?: boolean;
}

export function Contact({ params, close }: { params: ContactParams, close?: ()=>void }) {
  const { state, actions } = useContact(params);

  return (
    <div className={classes.contact}>
      <div className={classes.detail}>
        <div className={classes.header}>
          { close && (
            <IconX size={28} className={classes.match}  />
          )}
          <Text className={classes.label}>{`${state.handle}${state.node ? '/' + state.node : ''}`}</Text>
          { close && (
            <IconX size={30} className={classes.close} onClick={close} />
          )}
        </div>
        <div className={classes.image}>
          <Image radius="md" src={state.imageUrl} />
        </div>
        <div className={classes.divider} />
        {!state.name && (
          <Text className={classes.nameUnset}>{state.strings.name}</Text>
        )}
        {state.name && (
          <Text className={classes.nameSet}>{state.name}</Text>
        )}
        <div className={classes.entry}>
          <div className={classes.entryIcon}>
            <IconMapPin />
          </div>
          {!state.location && (
            <Text className={classes.entryUnset}>
              {state.strings.location}
            </Text>
          )}
          {state.location && (
            <Text className={classes.entrySet}>{state.location}</Text>
          )}
        </div>
        <div className={classes.entry}>
          <div className={classes.entryIcon}>
            <IconBook />
          </div>
          {!state.description && (
            <Text className={classes.entryUnset}>
              {state.strings.description}
            </Text>
          )}
          {state.description && (
            <Text className={classes.entrySet}>
              {state.description}
            </Text>
          )}
        </div>
        <div className={classes.divider} />
        { state.statusLabel === 'unknownStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconDeviceFloppy />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.save }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'savedStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconRoute2 />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.connect }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'pendingStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconDeviceFloppy />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.save }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconCircleCheck />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.accept }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconVolumeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.ignore }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconArrowsCross />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.deny }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'requestedStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconCircleCheck />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.accept }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconVolumeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.ignore }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconArrowsCross />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.deny }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'connectingStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconCancel />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.cancel }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'connectedStatus' && (
          <div className={classes.actions}>
            <ActionIcon variant="subtle">
              <IconRouteX2 size={32} />
            </ActionIcon>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
        { state.statusLabel === 'offsyncStatus' && (
          <div className={classes.actions}>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconRefresh />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.resync }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconRouteX2 />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.disconnect }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconUserX />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.remove }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconEyeOff />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.block }</Text>
            </div>
            <div className={classes.action}>
              <ActionIcon variant="subtle">
                <IconAlertHexagon />
              </ActionIcon>
              <Text className={classes.actionLabel}>{ state.strings.report }</Text>
            </div>
          </div>
        )}
      </div>
      <div className={classes.status}>
        <Text className={classes[state.statusLabel]}>{ state.strings[state.statusLabel] }</Text>
      </div>
    </div>
  );
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


