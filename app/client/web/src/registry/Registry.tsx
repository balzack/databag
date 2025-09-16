import React from 'react'
import { useRegistry } from './useRegistry.hook'
import { TextInput } from '@mantine/core'
import classes from './Registry.module.css'
import { TbX, TbServer, TbUser } from "react-icons/tb";
import { Card } from '../card/Card'
import { ProfileParams } from '../profile/Profile'

export function Registry({ close, openContact }: { close?: () => void; openContact: (params: ProfileParams) => void }) {
  const { state, actions } = useRegistry()

  const contacts = state.contacts.map((profile, idx) => {
    const select = () => {
      const { guid, handle, node, name, location, description, imageUrl } = profile
      const params = { guid, handle, node, name, location, description, imageUrl }
      openContact(params)
    }
    return (
      <Card
        key={idx}
        className={classes.card}
        imageUrl={profile.imageUrl}
        name={profile.name}
        handle={profile.handle}
        node={profile.node}
        placeholder={state.strings.name}
        select={select}
        actions={[]}
      />
    )
  })

  return (
    <div className={classes.registry}>
      <div className={classes.header}>
        <TextInput
          className={classes.username}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<TbUser size={20} />}
          placeholder={state.strings.username}
          value={state.username}
          onChange={(event) => actions.setUsername(event.currentTarget.value)}
        />
        <TextInput
          className={classes.server}
          size="sm"
          leftSectionPointerEvents="none"
          leftSection={<TbServer size={20} />}
          placeholder={state.strings.node}
          value={state.server}
          onChange={(event) => actions.setServer(event.currentTarget.value)}
        />
        {close && <TbX size={28} className={classes.close} onClick={close} />}
      </div>
      {contacts.length !== 0 && <div className={classes.cards}>{contacts}</div>}
      {contacts.length === 0 && <div className={classes.none}>{state.strings.noContacts}</div>}
    </div>
  )
}
