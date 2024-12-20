import React, { useState } from 'react'
import { useDetails } from './useDetails.hook'
import classes from './Details.module.css'
import { IconX } from '@tabler/icons-react'

export function Details({ close }: { close?: () => void }) {
  const { state, actions } = useDetails()

  return (
    <div className={classes.details}>
      {close && <IconX size={30} className={classes.close} onClick={close} />}
    </div>
  )
}

