import React from 'react'
import { useBase } from './useBase.hook'
import classes from './Base.module.css'
import light from '../images/lightness.png'
import dark from '../images/darkness.png'
import { Image, Text } from '@mantine/core'
import { TbChevronRight } from "react-icons/tb";

export function Base() {
  const { state } = useBase()

  return (
    <div className={classes.base}>
      <div className={classes.header}>
        <Text className={classes.title}>Databag</Text>
        <Text className={classes.label}>{state.strings.communication}</Text>
      </div>
      <Image className={classes.image} src={state.scheme === 'dark' ? dark : light} fit="contain" />
      <div className={classes.instructions}>
        {state.contentSet && (state.profileSet === false || state.cardSet === false || state.channelSet === false) && (
          <div className={classes.steps}>
            {state.profileSet === false && <Text className={classes.step}>{state.strings.setupProfile}</Text>}
            <TbChevronRight className={classes.icon} />
            {(state.profileSet === false || state.cardSet === false) && <Text className={classes.step}>{state.strings.connectPeople}</Text>}
            <TbChevronRight className={classes.icon} />
            <Text className={classes.step}>{state.strings.startConversation}</Text>
          </div>
        )}
      </div>
    </div>
  )
}
