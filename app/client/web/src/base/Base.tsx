import React from 'react';
import { useBase } from './useBase.hook'
import classes from './Base.module.css'
import light from '../images/lightness.png'
import dark from '../images/darkness.png'
import { useMantineTheme, Image, Text } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

export function Base() {
  const { state } = useBase();
  const theme = useMantineTheme();

console.log(theme);

  return (
    <div className={classes.base}>
      <div className={classes.header}>
        <Text className={classes.title}>Databag</Text>
        <Text className={classes.label}>{ state.strings.communication }</Text>
      </div>
      <Image className={classes.image} src={state.scheme === 'dark' ? dark : light} fit="contain" />
      <div className={classes.steps}>
        <Text className={classes.step}>{ state.strings.setupProfile }</Text>
        <IconChevronRight className={classes.icon} />
        <Text className={classes.step}>{ state.strings.connectPeople }</Text>
        <IconChevronRight className={classes.icon} />
        <Text className={classes.step}>{ state.strings.startConversation }</Text>
      </div>
    </div>
  );
}

