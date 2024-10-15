import React, {useEffect} from 'react';
import { useContact } from './useContact.hook';
import classes from './Contact.module.css';
import { IconX, IconMapPin, IconBook } from '@tabler/icons-react';
import {
  Text,
  Image,
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
    </div>
  );
}

